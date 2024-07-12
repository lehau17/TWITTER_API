import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import TWEET_MESSAGE from '~/constants/TweetMessage'
import { USER_MESSAGE } from '~/constants/userMessage'
import { ErrorWithStatus } from '~/models/errors'
import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'
import { enumToArray } from '~/utils/commons'
import { validate } from '~/utils/validate'
const arrTweetType = enumToArray(TweetType)
const arrTweetAudience = enumToArray(TweetAudience)
export const checkValidateCreateTweet = validate(
  checkSchema(
    {
      type: {
        isEmpty: false,
        custom: {
          options: (value, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus(TWEET_MESSAGE.TWEETTYPE_NOT_EMPTY, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            const exist = arrTweetType.findIndex((t) => t === value)

            if (exist === -1) {
              throw new ErrorWithStatus(TWEET_MESSAGE.TWEETTYPE_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      audience: {
        custom: {
          options: (value, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus(TWEET_MESSAGE.AUDIENCE_NOT_EMPTY, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            const exist = arrTweetAudience.findIndex((t) => t === value)
            if (exist === -1) {
              throw new ErrorWithStatus(TWEET_MESSAGE.AUDIENCE_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const { type } = req.body
            if (
              [TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].some((t) => t === type) &&
              ObjectId.isValid(value)
            ) {
              return true
            }
            if ([TweetType.Retweet].every((t) => t === type) && value === null) {
              return true
            }

            throw new ErrorWithStatus(TWEET_MESSAGE.TWEET_TYPE_AND_PARENT_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
        }
      },
      content: {
        custom: {
          options: (value, { req }) => {
            const { type, mentions, hashtags } = req.body as CreateTweetReqBody
            if ([TweetType.Retweet].every((t) => t === type) && value === '') {
              return true
            }
            if (
              [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].some((t) => t === type) &&
              mentions.length === 0 &&
              hashtags.length === 0 &&
              typeof value === 'string' &&
              value !== ''
            ) {
              return true
            }

            throw new ErrorWithStatus(TWEET_MESSAGE.CONTENT_IS_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!value.every((item: any) => typeof item === 'string')) {
              throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value) => {
            if (value.length === 0) return true
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value) => {
            if (value.length === 0) return true

            // if (!value.every((item: any) => typeof item === )) {
            //   throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            // }
            return true
          }
        }
      }
    },

    ['body']
  )
)

export const checkValidateAudience = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet

  if (tweet.audience === TweetAudience.TwitterCircle) {
    if (!req.decode_access_token) {
      throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_ACCESS_TOKEN, HTTP_STATUS.UNAUTHORiZED)
    }
    const author = await databaseService.getUsers.findOne({ _id: tweet.user_id })

    if (!author || author.verify == UserVerifyStatus.Banned) {
      throw new ErrorWithStatus(USER_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    const { user_id } = req.decode_access_token
    const isInCricle = author.tweet_cricle.some((c) => c.equals(user_id))

    if (!isInCricle && !author._id.equals(user_id)) {
      throw new ErrorWithStatus(USER_MESSAGE.FORMIDABLE_ACCESS_TWEET, HTTP_STATUS.FORBIDDEN)
    }
  }
  next()
}

export const checkValidatePagination = validate(
  checkSchema(
    {
      page: {
        isNumeric: true,
        custom: {
          options: (value) => {
            if (Number(value) < 0) {
              throw new ErrorWithStatus(USER_MESSAGE.PAGE_NOT_LETTER_THANP_ZERO, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      limit: {
        isNumeric: true,
        custom: {
          options: (value) => {
            if (Number(value) < 0 || Number(value) > 200) {
              throw new ErrorWithStatus(
                USER_MESSAGE.LIMIT_BETWEEN_ZERO_AND_TWO_HUNDREND,
                HTTP_STATUS.UNPROCESSABLE_ENTITY
              )
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)

export const checkValidateTypeTweet = validate(
  checkSchema(
    {
      type: {
        custom: {
          options: (value) => {
            if ([TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].some((t) => t === Number(value))) {
              return true
            }
            throw new ErrorWithStatus(TWEET_MESSAGE.TWEETTYPE_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
        }
      }
    },
    ['query']
  )
)
