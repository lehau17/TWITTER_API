import { ObjectId } from 'mongodb'

interface HashtagType {
  name: string
}

export class Hashtag {
  _id?: ObjectId
  name: string
  create_at?: Date
  constructor({ name }: HashtagType) {
    this._id = new ObjectId()
    this.name = name
    this.create_at = new Date()
  }
}
