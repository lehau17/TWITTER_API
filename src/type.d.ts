import { MediaUploadImgReqBody } from './models/requests/Media.request'
import { TokenPayLoad } from './models/requests/User.request'
import { Tweet } from './models/schemas/Tweet.schema'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
    decode_forgot_password_token?: TokenPayLoad
    decode_access_token?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
    decode_email_verify_token?: TokenPayLoad
    tweet?: Tweet
  }
}
