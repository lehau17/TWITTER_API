import express, { NextFunction, Request, Response } from 'express'
import {
  uploadMultiImgController,
  uploadSingleImgController,
  uploadSingleVideoController
} from '~/controllers/media.controllers'
import { checkValidateAccessToken, checkValidateVerifiedUser } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const mediaRouter = express.Router()

mediaRouter.post(
  '/upload-img',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  wrapperRequestHandler(uploadSingleImgController)
)
mediaRouter.post(
  '/upload-imgs',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  wrapperRequestHandler(uploadMultiImgController)
)
mediaRouter.post(
  '/upload-video',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  wrapperRequestHandler(uploadSingleVideoController)
)
export default mediaRouter
