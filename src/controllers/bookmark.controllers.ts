import { ParamsDictionary } from 'express-serve-static-core'
import express from 'express'
import { CreatBookmarkQebBody } from '~/models/requests/BookMark.request'
import bookMarkService from '~/services/bookmark.services'
import { TokenPayLoad } from '~/models/requests/User.request'
export const createBookmarkController = async (
  req: express.Request<ParamsDictionary, any, CreatBookmarkQebBody>,

  res: express.Response
) => {
  const { user_id } = req.decode_access_token as TokenPayLoad
  const { tweet_id } = req.body
  const result = await bookMarkService.createBookmarkSevice(user_id, tweet_id)
  return result
}
