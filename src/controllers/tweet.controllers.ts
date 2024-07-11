import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import { TokenPayLoad } from '~/models/requests/User.request'
import tweetService from '~/services/tweet.services'
export const createTweetController = async (
  request: Request<ParamsDictionary, any, CreateTweetReqBody>,
  response: Response
) => {
  const { user_id } = request.decode_access_token as TokenPayLoad
  const body = request.body
  const result = await tweetService.createTweetService(user_id, body)
  response.json(result)
}
