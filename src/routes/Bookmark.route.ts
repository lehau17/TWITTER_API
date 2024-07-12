import { Router } from 'express'
import { createBookmarkController, removeBookmarkController } from '~/controllers/bookmark.controllers'
import { checkValidateTweetId } from '~/middlewares/bookmark.middlewares'
import {
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidaVerifyToken
} from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/create',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateTweetId,
  wrapperRequestHandler(createBookmarkController)
)

bookMarkRouter.delete(
  '/tweet/:tweet_id',
  checkValidateAccessToken,
  checkValidaVerifyToken,
  wrapperRequestHandler(removeBookmarkController)
)

export default bookMarkRouter
