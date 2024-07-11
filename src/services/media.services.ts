import formidable, { File } from 'formidable'
import { mkdirp } from 'mkdirp'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Media/media'
import { getExtension } from '~/utils/files'
class MediaService {
  async uploadImgService(files: formidable.File[]) {
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const { filepath, newFilename } = file
        const pathFile = path.resolve('public/upload/img', newFilename)
        await sharp(filepath).jpeg().toFile(pathFile)
        fs.unlinkSync(filepath)
        if (isProduction()) {
          return {
            url: process.env.HOST + 'upload/img/' + newFilename,
            type: MediaType.Image
          }
        }
        return {
          url: process.env.URL_BACK_END_LOCAL + 'upload/img/' + newFilename,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  uploadVideoService(files: formidable.File[]) {
    const video: File = files[0]
    const { newFilename, originalFilename } = video

    const ext = getExtension(originalFilename as string)
    if (isProduction()) {
      return {
        url: process.env.HOST + 'upload/videos/' + newFilename + '.' + ext,
        type: MediaType.Video
      }
    }
    return {
      url: process.env.URL_BACK_END_LOCAL + 'upload/videos/' + newFilename + '.' + ext,
      type: MediaType.Video
    }
  }
}

export const mediaService = new MediaService()
