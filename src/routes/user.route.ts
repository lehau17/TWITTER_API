import express from 'express'
import {
  followController,
  getUserByTokenController,
  resetPasswordController,
  updateMeController,
  userEmailVerifyController,
  userForgotPasswordController,
  userLoginController,
  userLogoutController,
  userRegisterController,
  userResendEmailVerifyController,
  userVerifyForgotPasswordController
} from '~/controllers/user.controllers'
import {
  checkValidaVerifyToken,
  checkValidateAccessToken,
  checkValidateFollow,
  checkValidateForgotPassword,
  checkValidateForgotPasswordToken,
  checkValidateLogin,
  checkValidateLogout,
  checkValidateRegister,
  checkValidateResetPassword,
  checkValidateUpdateMe,
  checkValidateVerifiedUser
} from '~/middlewares/User.middleware'
import { filterFieldMidderware } from '~/middlewares/common.middlewares'
import { UpdateMeRequestBody } from '~/models/requests/User.request'
import { wrapperRequestHandler } from '~/utils/handleError'
const userRouter = express.Router()
userRouter.post('/logout', checkValidateLogout, wrapperRequestHandler(userLogoutController))
userRouter.post('/login', checkValidateLogin, wrapperRequestHandler(userLoginController))
userRouter.post('/register', checkValidateRegister, wrapperRequestHandler(userRegisterController))
userRouter.post('/verify-email', checkValidaVerifyToken, wrapperRequestHandler(userEmailVerifyController))
userRouter.post(
  '/resend-verify-email',
  checkValidateAccessToken,
  wrapperRequestHandler(userResendEmailVerifyController)
)
userRouter.post('/forgot-password', checkValidateForgotPassword, wrapperRequestHandler(userForgotPasswordController))
userRouter.post(
  '/verify-forgot-password',
  checkValidateForgotPasswordToken,
  wrapperRequestHandler(userVerifyForgotPasswordController)
)
userRouter.post('/reset-password', checkValidateResetPassword, wrapperRequestHandler(resetPasswordController))
userRouter.get('/me', checkValidateAccessToken, wrapperRequestHandler(getUserByTokenController))
userRouter.patch(
  '/me',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateUpdateMe,
  filterFieldMidderware<UpdateMeRequestBody>([
    'name',
    'avatar',
    'bio',
    'cover_photo',
    'date_of_birth',
    'location',
    'username',
    'website'
  ]),
  wrapperRequestHandler(updateMeController)
)

userRouter.post(
  '/follow',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateFollow,
  wrapperRequestHandler(followController)
)

export default userRouter
