import { Router } from 'express'
import { createBookmarkController } from '~/controllers/bookmark.controllers'
import { checkValidateAccessToken, checkValidaVerifyToken } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const bookMarkRouter = Router()

bookMarkRouter.post(
  'create',
  checkValidateAccessToken,
  checkValidaVerifyToken,
  wrapperRequestHandler(createBookmarkController)
)

export default bookMarkRouter
