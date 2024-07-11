import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType as TypeTweet } from '~/constants/enums'
import { Media } from '../Media/media'

interface TweetType {
  user_id: ObjectId
  type: TypeTweet
  audience: TweetAudience
  content: string | null
  parent_id: ObjectId | null
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
}

export class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TypeTweet
  audience: TweetAudience
  content: string | null
  parent_id?: ObjectId | null
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  create_at?: Date
  update_at?: Date

  constructor({
    user_id,
    type,
    audience,
    content,
    guest_views,
    hashtags,
    medias,
    mentions,
    parent_id,
    user_views
  }: TweetType) {
    const date = new Date()
    this.type = type
    this.audience = audience
    this.content = content
    this.guest_views = guest_views || 0
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.parent_id = parent_id
    this.user_id = user_id
    this.medias = medias
    this.user_views = user_views || 0
    this.create_at = date
    this.update_at = date
  }
}
