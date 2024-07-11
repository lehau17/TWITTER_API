import { ObjectId } from 'mongodb'

interface LikeType {
  user_id: string
  tweet_id: string
}
export class Like {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  create_at?: Date
  constructor({ tweet_id, user_id }: LikeType) {
    this.tweet_id = new ObjectId(tweet_id)
    this.user_id = new ObjectId(user_id)
    this.create_at = new Date()
    this._id = new ObjectId()
  }
}
