import { Fields, Files } from 'formidable'

export interface MediaUploadImgReqBody {
  fields: Files<string>
  files: Fields<string>
}
