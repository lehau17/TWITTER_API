import { ObjectId } from 'mongodb'
import { RefreshToken } from '~/models/schemas/refreshToken.schema'
import databaseService from '~/services/database.services'
class RefreshTokenService {
  // addRefreshTokenService = (refreshToken: string, user_id: ObjectId) => {
  //   return databaseService.getRefreshToken.insertOne(new RefreshToken(refreshToken, user_id))
  // }

  findRefreshToken = (refreshToken: string) => {
    return databaseService.getRefreshToken.findOne({ refresh_token: refreshToken })
  }

  deleteRefreshToken = (refreshToken: RefreshToken) => {
    return databaseService.getRefreshToken.deleteOne({ ...refreshToken })
  }
}
const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
