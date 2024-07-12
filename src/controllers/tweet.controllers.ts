import { ParamsDictionary } from 'express-serve-static-core'
import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import { TokenPayLoad } from '~/models/requests/User.request'
import tweetService from '~/services/tweet.services'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'
export const createTweetController = async (
  request: Request<ParamsDictionary, any, CreateTweetReqBody>,
  response: Response
) => {
  const { user_id } = request.decode_access_token as TokenPayLoad
  const body = request.body
  const result = await tweetService.createTweetService(user_id, body)
  response.json({ meg: 'Created tweet', result })
}

export const getTweetById = async (request: Request, response: Response) => {
  const viewIncrease = await tweetService.increaseViewTweet(
    (request.tweet?._id as ObjectId).toString(),
    request.decode_access_token?.user_id as string
  )
  const tweet = {
    ...request.tweet,
    guest_views: viewIncrease.guest_views,
    user_views: viewIncrease.user_views,
    update_at: viewIncrease.update_at
  }
  response.json({ meg: 'get detail tweet', result: tweet })
}

export const getChildrenTweet = async (request: Request, response: Response) => {
  const { tweet_id } = request.params
  const page = Number(request.query.page as string)
  const limit = Number(request.query.limit as string)
  const type = Number(request.query.type as string) as TweetType
  const user_id = request.decode_access_token?.user_id

  const result = await tweetService.getChildrenTweetService({ tweet_id, user_id, page, limit, type })
  return response.json({
    meg: 'Get children tweet',
    result,
    limit,
    page,
    total_pages: Math.ceil(result.total / limit)
  })
}

export const getNewFeeds = async (request: Request, response: Response) => {
  const page = Number(request.query.page as string)
  const limit = Number(request.query.limit as string)
  const user_id = (request.decode_access_token as TokenPayLoad).user_id

  const result = await tweetService.getNewFeedTweetService({ page, limit, user_id })
  return response.json({
    meg: 'Get new feed',
    result,
    limit,
    page
    // total_pages: Math.ceil(result.total / limit)
  })
}
