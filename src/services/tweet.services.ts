import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import databaseService from './database.services'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'
import hashTagService from './Hashtag.services'

class TweetService {
  async createTweetService(user_id: string, payload: CreateTweetReqBody) {
    const arrHashtagID = await hashTagService.checkExistAndCreate(payload.hashtags)
    const result = await databaseService.getTweets.insertOne(
      new Tweet({ ...payload, user_id: new ObjectId(user_id), hashtags: arrHashtagID })
    )
    return result
  }
}

const tweetService = new TweetService()
export default tweetService
