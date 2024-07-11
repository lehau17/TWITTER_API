import { Router } from 'express'
import { likedController, removeLikeController } from '~/controllers/like.controllers'
import { checkValidateCreateBookmark } from '~/middlewares/bookmark.middlewares'
import { checkValidateAccessToken, checkValidateVerifiedUser } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const likeRouter = Router()

likeRouter.post(
  '/liked',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateCreateBookmark,
  wrapperRequestHandler(likedController)
)

likeRouter.delete(
  'unLike/tweet/:tweet_id',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  wrapperRequestHandler(removeLikeController)
)
export default likeRouter
