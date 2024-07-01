import { ObjectId } from 'mongodb'

export class RefreshToken {
  _id?: ObjectId
  refresh_token: string
  create_at: Date
  update_at?: Date

  constructor(refreshToken: string) {
    const date = new Date()
    this.refresh_token = refreshToken
    this.create_at = date
    this.update_at = date
  }
}
