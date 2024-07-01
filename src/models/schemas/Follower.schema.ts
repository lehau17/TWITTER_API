import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface FollowerType {
  _id?: ObjectId
  user_id: ObjectId
  follow_user_id: ObjectId
  create_at?: Date
}

export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  follow_user_id: ObjectId
  create_at?: Date
  constructor(follower: FollowerType) {
    this._id = follower._id
    this.user_id = follower.user_id
    this.follow_user_id = follower.follow_user_id
    this.create_at = follower.create_at || new Date()
  }
}
