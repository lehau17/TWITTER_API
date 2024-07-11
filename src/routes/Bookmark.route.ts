import { Router } from 'express'
import { createBookmarkController } from '~/controllers/bookmark.controllers'
import { checkValidateCreateBookmark } from '~/middlewares/bookmark.middlewares'
import { checkValidateAccessToken, checkValidaVerifyToken } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const bookMarkRouter = Router()

bookMarkRouter.post(
  'create',
  checkValidateAccessToken,
  checkValidaVerifyToken,
  checkValidateCreateBookmark,
  wrapperRequestHandler(createBookmarkController)
)

export default bookMarkRouter
