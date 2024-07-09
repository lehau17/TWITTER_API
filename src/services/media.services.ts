import formidable from 'formidable'
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
    mkdirp.mkdirpSync(path.resolve('public/upload/img'))
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
  async uploadVideoService(files: formidable.File[]) {
    mkdirp.mkdirpSync(path.resolve('public/upload/videos'))

    // const result: Media[] = undefined
    // await Promise.all(
    // files.map(async (file) => {
    //   file.newFilename = newFilename + '.' + getExtension(originalFilename as string)
    //   let { filepath, newFilename, originalFilename } = file
    //   console.log(filepath, newFilename)
    //   newFilename = newFilename + '.' + getExtension(originalFilename as string)
    //   const pathFile = path.resolve('public/upload/videos', newFilename)
    //   if (isProduction()) {
    //     return {
    //       url: process.env.HOST + 'upload/videos/' + newFilename,
    //       type: MediaType.Video
    //     }
    //   }
    //   return {
    //     url: process.env.URL_BACK_END_LOCAL + 'upload/videos/' + newFilename,
    //     type: MediaType.Video
    //   }
    // })
    // )
    return null
  }
}

export const mediaService = new MediaService()
