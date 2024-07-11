import { Router } from 'express'
import { likedController } from '~/controllers/like.controllers'
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

export default likeRouter
