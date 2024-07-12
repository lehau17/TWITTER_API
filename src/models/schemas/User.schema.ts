import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name?: string
  email?: string
  date_of_birth?: Date
  password?: string
  create_at?: Date
  update_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  tweet_cricle?: ObjectId[]
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  create_at: Date
  update_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  tweet_cricle: ObjectId[]
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(User: UserType) {
    const date = new Date()
    this._id = User._id
    this.name = User.name || ''
    this.email = User.email || ''
    this.password = User.password || ''
    this.date_of_birth = User.date_of_birth || date
    this.create_at = User.create_at || date
    this.update_at = User.update_at || date
    this.email_verify_token = User.email_verify_token || ''
    this.forgot_password_token = User.forgot_password_token || ''
    this.verify = User.verify || UserVerifyStatus.Unverified
    this.bio = User.bio || ''
    this.location = User.location || ''
    this.website = User.website || ''
    this.username = User.username || ''
    this.avatar = User.avatar || ''
    this.cover_photo = User.cover_photo || ''
    this.tweet_cricle = User.tweet_cricle || []
  }
}
