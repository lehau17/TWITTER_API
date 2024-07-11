import { Hashtag } from '~/models/schemas/Hashtag.schema'
import databaseService from './database.services'
import { WithId } from 'mongodb'

class HashtagService {
  async checkExistAndCreate(hashtags: string[]) {
    const result = await Promise.all(
      hashtags.map(async (hashtag) => {
        // Tìm hashtag và cập nhật nếu không tồn tại
        const updatedHashtag = await databaseService.getHashTags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
        return updatedHashtag // Trả về document đã được tìm thấy hoặc được tạo mới
      })
    )

    return result.map((i) => (i as WithId<Hashtag>)._id) // Trả về một mảng các document đã được tìm thấy hoặc được tạo mới
  }
}

const hashTagService = new HashtagService()
export default hashTagService
