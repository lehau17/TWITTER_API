import { TypeToken } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  password: string
  conformPassword: string
  email: string
  date_of_birth: string // ISO String
}

export interface TokenPayLoad {
  user_id: string
  typeToken: TypeToken
  iat: number
  exp: number
}
