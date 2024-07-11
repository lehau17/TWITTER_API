import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { Bookmark } from '~/models/schemas/Bookmark.schema'

class BookMarkService {
  createBookmarkSevice(user_id: string, tweet_id: string) {
    return databaseService.getBookMarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({ tweet_id, user_id })
      },
      {
        returnDocument: 'after',
        upsert: true
      }
    )
  }
}

const bookMarkService = new BookMarkService()

export default bookMarkService
