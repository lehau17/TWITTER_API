import { Router } from 'express'
import { createBookmarkController, removeBookmarkController } from '~/controllers/bookmark.controllers'
import { checkValidateCreateBookmark } from '~/middlewares/bookmark.middlewares'
import { checkValidateAccessToken, checkValidaVerifyToken } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/create',
  checkValidateAccessToken,
  checkValidaVerifyToken,
  checkValidateCreateBookmark,
  wrapperRequestHandler(createBookmarkController)
)

bookMarkRouter.delete(
  '/tweet/:tweet_id',
  checkValidateAccessToken,
  checkValidaVerifyToken,
  wrapperRequestHandler(removeBookmarkController)
)

export default bookMarkRouter
