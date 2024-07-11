import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Media/media'

export interface CreateTweetReqBody {
  type: TweetType
  audience: TweetAudience
  content: string | null
  parent_id: ObjectId | null
  hashtags: string[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
}
