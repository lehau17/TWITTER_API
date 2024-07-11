import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { Like } from '~/models/schemas/Like.schema'

class LikeService {
  likedService(user_id: string, tweet_id: string) {
    return databaseService.getLikes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({ tweet_id, user_id })
      },
      {
        returnDocument: 'after',
        upsert: true
      }
    )
  }
  unLikekSevice(user_id: string, tweet_id: string) {
    return databaseService.getLikes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
  }
}

const likeService = new LikeService()
export default likeService
