import { ParamsDictionary } from 'express-serve-static-core'
import express from 'express'
import { TokenPayLoad } from '~/models/requests/User.request'
import { LikedReqBody } from '~/models/requests/Like.request'
import likeService from '~/services/like.services'
export const likedController = async (
  req: express.Request<ParamsDictionary, any, LikedReqBody>,

  res: express.Response
) => {
  const { user_id } = req.decode_access_token as TokenPayLoad
  const { tweet_id } = req.body
  const result = await likeService.likedService(user_id, tweet_id)
  return res.json({ meg: 'Liked', result })
}

export const removeLikeController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decode_access_token as TokenPayLoad
  const { tweet_id } = req.params
  const result = await likeService.unLikekSevice(user_id, tweet_id)
  return res.json({ meg: 'un like', result })
}
