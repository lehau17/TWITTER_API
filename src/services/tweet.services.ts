import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import databaseService from './database.services'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { ObjectId, WithId } from 'mongodb'
import hashTagService from './Hashtag.services'
import { TweetAudience, TweetType } from '~/constants/enums'
import followerService from './follower.services'
import { count } from 'console'

class TweetService {
  async createTweetService(user_id: string, payload: CreateTweetReqBody) {
    const arrHashtagID = await hashTagService.checkExistAndCreate(payload.hashtags)
    const result = await databaseService.getTweets.insertOne(
      new Tweet({
        ...payload,
        user_id: new ObjectId(user_id),
        hashtags: arrHashtagID,
        parent_id: payload.parent_id === null ? null : new ObjectId(payload.parent_id)
      })
    )
    return result
  }
  async increaseViewTweet(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.getTweets.findOneAndUpdate(
      {
        _id: new ObjectId(tweet_id)
      },
      {
        $inc: inc,
        $currentDate: { update_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1,
          update_at: 1
        }
      }
    )
    return result as WithId<{ guest_views: number; user_views: number; update_at: Date }>
  }

  async getChildrenTweetService({
    tweet_id,
    user_id,
    page,
    limit,
    type
  }: {
    tweet_id: string
    user_id?: string
    page: number
    limit: number
    type: TweetType
  }) {
    // get list children tweet
    const tweet = await databaseService.getTweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),
            type: type
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  username: '$$mention.username',
                  email: '$$mention.email'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_child'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$bookmarks'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 1]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 2]
                  }
                }
              }
            },
            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 3]
                  }
                }
              }
            },
            views: {
              $add: ['$user_views', '$guest_views']
            }
          }
        },
        {
          $project: {
            tweet_child: 0
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    // get list iD for increased view count
    const tweetIds = tweet.map((tweet) => tweet._id as ObjectId)
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const date = new Date()
    const [, total] = await Promise.all([
      await databaseService.getTweets.updateMany(
        {
          _id: { $in: tweetIds }
        },
        {
          $inc: inc,
          $set: {
            update_at: date
          }
        }
      ),
      await databaseService.getTweets.countDocuments({
        parent_id: new ObjectId(tweet_id),
        type: type
      })
    ])
    tweet.forEach((tweet) => {
      tweet.update_at = date
      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })
    return {
      tweet,
      total
    }
  }

  async getNewFeedTweetService({ page, limit, user_id }: { page: number; limit: number; user_id: string }) {
    const user_objID = new ObjectId(user_id)
    const ids = await followerService.getFollowerIdsByUserId(user_id)
    const [tweet, total] = await Promise.all([
      await databaseService.getTweets
        .aggregate<Tweet>([
          {
            $match: {
              user_id: { $in: ids }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                { audience: TweetAudience.Everyone },
                { $and: [{ audience: TweetAudience.TwitterCircle }, { 'user.tweet_cricle': { $in: [user_objID] } }] }
              ]
            }
          },
          {
            $lookup: {
              from: 'hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'hashtags'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions'
            }
          },
          {
            $addFields: {
              mentions: {
                $map: {
                  input: '$mentions',
                  as: 'mention',
                  in: {
                    _id: '$$mention._id',
                    name: '$$mention.name',
                    username: '$$mention.username',
                    email: '$$mention.email'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweet_child'
            }
          },
          {
            $addFields: {
              bookmarks: {
                $size: '$bookmarks'
              },
              likes: {
                $size: '$bookmarks'
              },
              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweet_child',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 1]
                    }
                  }
                }
              },
              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweet_child',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 2]
                    }
                  }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet_child',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 3]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              tweet_child: 0,
              user: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                tweet_cricle: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.getTweets
        .aggregate([
          {
            $match: {
              user_id: { $in: ids }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                { audience: TweetAudience.Everyone },
                { $and: [{ audience: TweetAudience.TwitterCircle }, { 'user.tweet_cricle': { $in: [user_objID] } }] }
              ]
            }
          },
          {
            $count: 'tweet_count'
          }
        ])
        .toArray()
    ])
    const date = new Date()
    const tweetIds = tweet.map((tweet) => tweet._id as ObjectId)

    await databaseService.getTweets.updateMany(
      {
        _id: { $in: tweetIds }
      },
      {
        $inc: { user_views: 1 },
        $set: {
          update_at: date
        }
      }
    )
    tweet.forEach((tweet) => {
      tweet.update_at = date
      tweet.user_views += 1
    })
    return { tweet, total: total[0].tweet_count }
  }
}

const tweetService = new TweetService()
export default tweetService
