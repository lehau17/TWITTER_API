import { TypeToken, UserVerifyStatus } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  password: string
  conformPassword: string
  email: string
  date_of_birth: string // ISO String
}
export interface FollowRequestBody {
  follow_user_id: string
}

export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface TokenPayLoad {
  user_id: string
  typeToken: TypeToken
  verify: UserVerifyStatus
  iat: number
  exp: number
}
