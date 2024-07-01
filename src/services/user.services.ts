import databaseService from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TypeToken, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/errors'
import { USER_MESSAGE } from '~/constants/userMessage'
import { HTTP_STATUS } from '~/constants/httpStatus'

class UserService {
  /**
   * payload : id user
   * exp : 1h
   */
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.AccessToken },
      options: {
        expiresIn: '1h'
      }
    })
  }

  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.ForgotPasswordToken },
      privateKey: process.env.PRIVATE_PASSWORD_TOKEN,
      options: {
        expiresIn: '3h'
      }
    })
  }
  /**
   * payload : id user
   * exp : 100d
   */
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.RefreshToken },
      options: {
        expiresIn: '100d'
      }
    })
  }

  private signEmailVerifyToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id, typeToken: TypeToken.VerifyEmailToken },
      options: {
        expiresIn: '15m'
      }
    })
  }
  /**
   *
   * @param user_id
   * @returns Promise<String, string>
   * @description: Promis.all 2 token acess and refresh
   */
  async signAccessAndRefreshToken(user_id: string) {
    return await Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  /**
   *
   * @param payload   name: string password: string conformPassword: string email: string date_of_birth: string // ISO String
   * @returns {user_id, accessToken, refreshToken}
   */
  async register(payload: RegisterRequestBody) {
    const _id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(_id.toString())
    const result = await databaseService.getUsers.insertOne(
      new User({
        ...payload,
        _id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(_id.toString())
    return { ...result, accessToken, refreshToken }
  }
  async isEmailExist(value: { email: string; password?: string }) {
    const result = await databaseService.getUsers.findOne({ ...value })
    return result
  }
  async login(id: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(id)
    return { accessToken, refreshToken }
  }
  async verifyEmail(user_id: string) {
    const user = await databaseService.getUsers.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus(USER_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (user.email_verify_token === '') {
      throw new ErrorWithStatus(USER_MESSAGE.VERIFID_EMAIL_TOKEN, HTTP_STATUS.OK)
    }
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      databaseService.getUsers.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        { $set: { email_verify_token: '', verify: UserVerifyStatus.Verified }, $currentDate: { update_at: true } }
      )
    ])
    const [accessToken, refreshToken] = token
    return { accessToken, refreshToken }
  }
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)

    const result = await databaseService.getUsers.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { email_verify_token: email_verify_token },
        $currentDate: { update_at: true }
      }
    )
    return result
  }
  async forgotPassword(_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(_id)
    await databaseService.getUsers.updateOne(
      {
        _id: new ObjectId(_id)
      },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          update_at: true
        }
      }
    )
    // gửi email ở đây
    return { token: forgot_password_token }
  }
  async resetPasswordService(user_id: string, password: string) {
    return await databaseService.getUsers.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { password: hashPassword(password) }, $currentDate: { update_at: true } }
    )
  }
  async getUserByID(user_id: string) {
    return await databaseService.getUsers.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0
        }
      }
    )
  }
}

const userService = new UserService()
export default userService
