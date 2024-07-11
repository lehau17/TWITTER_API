import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  refresh_token: string
  create_at?: Date
  update_at?: Date
  user_id?: ObjectId
  exp: number
  iat: number
}

export class RefreshToken {
  _id?: ObjectId
  refresh_token: string
  create_at?: Date
  update_at?: Date
  user_id?: ObjectId
  exp: Date
  iat: Date

  constructor({ refresh_token, user_id, exp, iat }: RefreshTokenType) {
    const date = new Date()
    this.refresh_token = refresh_token
    this.create_at = date
    this.update_at = date
    this.user_id = user_id
    this.exp = new Date(exp)
    this.iat = new Date(iat * 1000)
  }
}
