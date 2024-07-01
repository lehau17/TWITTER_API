import { RefreshToken } from '~/models/schemas/refreshToken.schema'
import databaseService from '~/services/database.services'
class RefreshTokenService {
  addRefreshTokenService = (refreshToken: string) => {
    return databaseService.getRefreshToken.insertOne(new RefreshToken(refreshToken))
  }

  findRefreshToken = (refreshToken: string) => {
    return databaseService.getRefreshToken.findOne({ refresh_token: refreshToken })
  }

  deleteRefreshToken = (refreshToken: RefreshToken) => {
    return databaseService.getRefreshToken.deleteOne({ ...RefreshToken })
  }
}
const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
