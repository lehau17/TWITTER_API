import express from 'express'
import {
  getUserByTokenController,
  resetPasswordController,
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
  checkValidateForgotPassword,
  checkValidateForgotPasswordToken,
  checkValidateLogin,
  checkValidateLogout,
  checkValidateRegister,
  checkValidateResetPassword
} from '~/middlewares/User.middleware'
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
export default userRouter
