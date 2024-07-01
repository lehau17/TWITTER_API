import databaseService from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TypeToken, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/errors'
import { USER_MESSAGE } from '~/constants/userMessage'
import { HTTP_STATUS } from '~/constants/httpStatus'
import Follower from '~/models/schemas/Follower.schema'

class UserService {
  /**
   * payload : id user
   * exp : 1h
   */
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.AccessToken, verify },
      options: {
        expiresIn: '1h'
      }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.ForgotPasswordToken, verify },
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
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, typeToken: TypeToken.RefreshToken, verify },
      options: {
        expiresIn: '100d'
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }): Promise<string> {
    return signToken({
      payload: { user_id, typeToken: TypeToken.VerifyEmailToken, verify },
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
  async signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  /**
   *
   * @param payload   name: string password: string conformPassword: string email: string date_of_birth: string // ISO String
   * @returns {user_id, accessToken, refreshToken}
   */
  async register(payload: RegisterRequestBody) {
    const _id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const result = await databaseService.getUsers.insertOne(
      new User({
        ...payload,
        _id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    return { ...result, accessToken, refreshToken }
  }
  async isEmailExist(value: { email: string; password?: string }) {
    const result = await databaseService.getUsers.findOne({ ...value })
    return result
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ user_id, verify })
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
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
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
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })

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
  async forgotPassword(_id: string, verify: UserVerifyStatus) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id: _id, verify })
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
  async updateMeService(user_id: string, payload: UpdateMeRequestBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    return await databaseService.getUsers.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeRequestBody & { date_of_birth: Date })
        },
        $currentDate: {
          update_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
  }
  async followService(user_id: string, follow_user_id: string) {
    const follower = await databaseService.getFollowers.findOne({
      user_id: new ObjectId(user_id),
      follow_user_id: new ObjectId(follow_user_id)
    })
    console.log(follower)

    if (follower === null) {
      const result = await databaseService.getFollowers.insertOne(
        new Follower({ user_id: new ObjectId(user_id), follow_user_id: new ObjectId(follow_user_id) })
      )
      return result
    }
    return { success: false, meg: 'Follower is Exist' }
  }
}

const userService = new UserService()
export default userService
