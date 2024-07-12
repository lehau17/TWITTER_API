import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class FollowerService {
  async getFollowerIdsByUserId(user_id: string) {
    const result = await databaseService.getFollowers
      .find({
        user_id: new ObjectId(user_id)
      })
      .toArray()
    const Ids = result.map((i) => i.follow_user_id)
    Ids.push(new ObjectId(user_id))
    return Ids
  }
}

const followerService = new FollowerService()
export default followerService
