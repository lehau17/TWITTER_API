import { NextFunction, Request, Response } from 'express'
import * as core from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/userMessage'
import { ErrorWithStatus } from '~/models/errors'
import { RegisterRequestBody, TokenPayLoad } from '~/models/requests/User.request'
import databaseService from '~/services/database.services'
import refreshTokenService from '~/services/refreshToken.services'
import userService from '~/services/user.services'

export const userLoginController = async (req: Request, res: Response) => {
  const { user_id }: any = req
  const result = await userService.login(user_id.toString())
  await refreshTokenService.addRefreshTokenService(result.refreshToken as string)
  res.status(200).json({ ...result, message: USER_MESSAGE.LOGIN_SUCCESS })
}

export const userRegisterController = async (
  req: Request<core.ParamsDictionary, any, RegisterRequestBody>,
  res: Response
) => {
  const result = await userService.register(req.body)
  res.status(200).json({ ...result, message: USER_MESSAGE.REGISTER_SUCCESS })
}
/**
 *
 *  lấy payload của refresh token
 *  xóa refresh token theo payload
 */
export const userLogoutController = async (req: Request, res: Response) => {
  const decodeRefreshToken: any = { req }
  const result = await refreshTokenService.deleteRefreshToken(decodeRefreshToken.user_id)
  res.status(200).json({ ...result, message: USER_MESSAGE.LOGOUT_SUCCESS })
}

export const userEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_email_verify_token as TokenPayLoad
  const result = await userService.verifyEmail(user_id)
  res.status(HTTP_STATUS.OK).json(result)
}

export const userResendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_access_token as TokenPayLoad
  const user = await databaseService.getUsers.findOne({ _id: new ObjectId(user_id as string) })
  if (!user) {
    throw new ErrorWithStatus(USER_MESSAGE.NOT_FOUND, 404)
  }
  if (user.verify === UserVerifyStatus.Verified) {
    res.status(HTTP_STATUS.OK).json('already_verified')
  }
  const result = await userService.resendVerifyEmail(user_id)
  res.status(HTTP_STATUS.OK).json({ meg: 'success', result })
}

export const userForgotPasswordController = async (req: Request, res: Response) => {
  const { _id } = (req as any).user
  const result = await userService.forgotPassword(_id.toString())
  res.json(result)
}

export const userVerifyForgotPasswordController = (req: Request, res: Response) => {
  res.json({ meg: 'OK' })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_forgot_password_token as TokenPayLoad
  const { password } = req.body
  const result = await userService.resetPasswordService(user_id, password)
  res.status(200).json({ meg: 'Reset Password successfully', result })
}

export const getUserByTokenController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_access_token as TokenPayLoad
  const result = await userService.getUserByID(user_id)
}