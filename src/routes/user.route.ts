import express, { Request, Response } from 'express'
import {
  changePasswordController,
  followController,
  getUserByTokenController,
  oauthController,
  resetPasswordController,
  unFollowController,
  updateMeController,
  userEmailVerifyController,
  userForgotPasswordController,
  userLoginController,
  userLogoutController,
  userRefreshTokenController,
  userRegisterController,
  userResendEmailVerifyController,
  userVerifyForgotPasswordController
} from '~/controllers/user.controllers'
import {
  checkValidaVerifyToken,
  checkValidateAccessToken,
  checkValidateChangePassword,
  checkValidateFollow,
  checkValidateForgotPassword,
  checkValidateForgotPasswordToken,
  checkValidateLogin,
  checkValidateLogout,
  checkValidateRefreshToken,
  checkValidateRegister,
  checkValidateResetPassword,
  checkValidateUnfollow,
  checkValidateUpdateMe,
  checkValidateVerifiedUser
} from '~/middlewares/User.middleware'
import { filterFieldMidderware } from '~/middlewares/common.middlewares'
import { TokenPayLoad, UnfollowParamsRequestBody, UpdateMeRequestBody } from '~/models/requests/User.request'
import { wrapperRequestHandler } from '~/utils/handleError'
const userRouter = express.Router()
userRouter.post('/logout', checkValidateLogout, wrapperRequestHandler(userLogoutController))
userRouter.post('/login', checkValidateLogin, wrapperRequestHandler(userLoginController))
userRouter.post('/refresh-token', checkValidateRefreshToken, wrapperRequestHandler(userRefreshTokenController))
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

userRouter.post('/follow', checkValidateAccessToken, checkValidateVerifiedUser, checkValidateFollow, followController)

userRouter.delete(
  '/unfollow/:follow_user_id',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateUnfollow,
  wrapperRequestHandler(unFollowController)
)

userRouter.put(
  'changePassword',
  checkValidateAccessToken,
  checkValidateChangePassword,
  wrapperRequestHandler(changePasswordController)
)

//ouath 2.0 google
userRouter.get('/oauth/google', wrapperRequestHandler(oauthController))
export default userRouter
