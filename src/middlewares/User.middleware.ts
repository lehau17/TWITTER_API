import { ErrorWithStatus } from '~/models/errors'
import { USER_MESSAGE } from '~/constants/userMessage'
import { checkSchema } from 'express-validator'
import userService from '~/services/user.services'
import { validate } from '~/utils/validate'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import refreshTokenService from '~/services/refreshToken.services'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { JsonWebTokenError } from 'jsonwebtoken'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const checkValidateRegister = validate(
  checkSchema(
    {
      name: {
        trim: true,
        isLength: {
          options: {
            min: 3,
            max: 100
          },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_NAME
        }
      },
      date_of_birth: {
        isISO8601: {
          errorMessage: USER_MESSAGE.ERROR_ISODATE_DOB
        }
      },
      email: {
        isEmail: { errorMessage: USER_MESSAGE.ERROR_NOT_EMAIL },
        trim: true,
        custom: {
          options: async (value: string) => {
            const isExist = await userService.isEmailExist({ email: value })
            if (isExist) {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_EXISTS_EMAIL, 401)
            } else {
              return true
            }
          }
        }
      },
      password: {
        isLength: {
          options: { min: 8, max: 20 },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_PASSWORD
        }
      },
      conformPassword: {
        isLength: {
          options: { min: 8, max: 20 },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_PASSWORD
        },
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.ERROR_PASSWORD_NOT_MATCH)
            } else {
              return true
            }
          }
        }
      }
    },
    ['body']
  )
)

export const checkValidateLogin = validate(
  checkSchema(
    {
      password: {
        isLength: {
          options: { min: 8, max: 20 },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_PASSWORD
        }
      },
      email: {
        trim: true,
        isEmpty: false,
        custom: {
          options: async (value: string, { req }) => {
            const user = await userService.isEmailExist({
              email: value,
              password: hashPassword(req.body.password)
            })

            if (user) {
              req.user_id = user._id
              return true
            } else {
              throw new ErrorWithStatus(USER_MESSAGE.LOGIN_FAILED, 401)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const checkValidateLogout = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (accessToken === '') {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            const decode = await verifyToken(accessToken, process.env.PRIVATE_KEY as string)
            req.decode = decode
            return true
          }
        }
      },
      refresh_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            try {
              const [decodeRefreshToken, refreshToken] = await Promise.all([
                await verifyToken(value, process.env.PRIVATE_KEY as string),
                await refreshTokenService.findRefreshToken(value)
              ])
              if (refreshToken !== null) {
                req.refreshToken = refreshToken
              } else {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORiZED)
              }
            } catch (error) {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            return true
          }
        }
      }
    },
    ['headers', 'body']
  )
)

export const checkValidaVerifyToken = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (value === '' || !value) {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            try {
              const decode_email_verify_token = await verifyToken(value, process.env.PRIVATE_EMAIL_TOKEN as string)
              if (decode_email_verify_token !== null) {
                req.decode_email_verify_token = decode_email_verify_token
              } else {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_EMAIL_VERIFY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
              }
            } catch (error) {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_EMAIL_VERIFY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const checkValidateAccessToken = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (accessToken === '') {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
            try {
              const decode_access_token = await verifyToken(accessToken, process.env.PRIVATE_KEY as string)
              req.decode_access_token = decode_access_token
              return true
            } catch (error) {
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_ACCESS_TOKEN, HTTP_STATUS.UNAUTHORiZED)
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const checkValidateForgotPasswordToken = validate(
  checkSchema(
    {
      forgot_password_token: {
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (value === '') {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.BAD_REQUEST)
              }
              const decode_forgot_password_token = await verifyToken(
                value,
                process.env.PRIVATE_PASSWORD_TOKEN as string
              )
              console.log(decode_forgot_password_token)

              const { user_id } = decode_forgot_password_token as any

              const user = await databaseService.getUsers.findOne({ _id: new ObjectId(user_id as string) })
              if (!user) {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_USER, HTTP_STATUS.BAD_REQUEST)
              }
              if (user.forgot_password_token === value) {
                return true
              }
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.BAD_REQUEST)
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.BAD_REQUEST)
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const checkValidateForgotPassword = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: USER_MESSAGE.ERROR_NOT_EMAIL },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await userService.isEmailExist({ email: value })
            if (!user) {
              throw new Error(USER_MESSAGE.ERROR_NOT_EXISTS_EMAIL)
            } else {
              req.user = user
              return true
            }
          }
        }
      }
    },
    ['body']
  )
)

export const checkValidateResetPassword = validate(
  checkSchema(
    {
      password: {
        isLength: {
          options: { min: 8, max: 20 },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_PASSWORD
        }
      },
      conformPassword: {
        isLength: {
          options: { min: 8, max: 20 },
          errorMessage: USER_MESSAGE.ERROR_LENGTH_PASSWORD
        },
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.ERROR_PASSWORD_NOT_MATCH)
            } else {
              return true
            }
          }
        }
      },
      forgot_password_token: {
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (value === '') {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_EMPTY_TOKEN, HTTP_STATUS.BAD_REQUEST)
              }
              const decode_forgot_password_token = await verifyToken(
                value,
                process.env.PRIVATE_PASSWORD_TOKEN as string
              )

              const { user_id } = decode_forgot_password_token as any

              const user = await databaseService.getUsers.findOne({ _id: new ObjectId(user_id as string) })
              if (!user) {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_USER, HTTP_STATUS.BAD_REQUEST)
              }
              if (user.forgot_password_token === value) {
                req.decode_forgot_password_token = decode_forgot_password_token
                return true
              }
              throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.BAD_REQUEST)
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus(USER_MESSAGE.ERROR_INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.BAD_REQUEST)
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)