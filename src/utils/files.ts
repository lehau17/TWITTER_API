import { Request } from 'express'
import formidable from 'formidable'
import { mkdirp } from 'mkdirp'
import path from 'path'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/userMessage'
import { ErrorWithStatus } from '~/models/errors'
import fs from 'fs'

export const uploadImg = (req: Request, quanlity: number) => {
  const form = formidable({
    keepExtensions: true,
    maxFiles: quanlity,
    allowEmptyFiles: false,
    maxFileSize: 1024 * 1024 * 200,
    filter: ({ name, originalFilename, mimetype }) => {
      let cancelUploads = false
      const valid = mimetype && mimetype.includes('image')
      if (!valid) {
        form.emit('error' as any, new ErrorWithStatus(USER_MESSAGE.FILE_INVALID, HTTP_STATUS.BAD_REQUEST) as any) // optional make form.parse error
        cancelUploads = true //variable to make filter return false after the first problem
      }
      return Boolean(valid && !cancelUploads)
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      console.log(files.img)

      if (!files.img) {
        return reject(new ErrorWithStatus(USER_MESSAGE.FIELD_INVALID, HTTP_STATUS.BAD_REQUEST))
      }
      resolve(files.img as formidable.File[])
    })
  })
}

export const uploadVideo = (req: Request, quanlity: number) => {
  const form = formidable({
    maxFiles: quanlity,
    uploadDir: UPLOAD_VIDEO_DIR,
    allowEmptyFiles: false,
    maxFileSize: 1024 * 1024 * 200,
    filter: ({ mimetype, name }) => {
      let cancelUploads = false
      const valid = mimetype && mimetype.includes('mp4') && mimetype.includes('quicktime') && name === 'video'
      if (!valid) {
        form.emit('error' as any, new ErrorWithStatus(USER_MESSAGE.FILE_INVALID, HTTP_STATUS.BAD_REQUEST) as any) // optional make form.parse error
        cancelUploads = true //variable to make filter return false after the first problem
      }
      return Boolean(valid && !cancelUploads)
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video) {
        return reject(new ErrorWithStatus(USER_MESSAGE.FIELD_INVALID, HTTP_STATUS.BAD_REQUEST))
      }
      const video = files.video
      video.forEach((video) => {
        fs.renameSync(video.filepath, video.filepath + '.' + getExtension(video.originalFilename as string))
      })
      resolve(files.video as formidable.File[])
    })
  })
}
export const getExtension = (orgirinName: string) => {
  const name = orgirinName.split('.')

  return name[name.length - 1]
}

export const createPublicPath = () => {
  mkdirp.mkdirpSync(path.resolve('public/upload/videos'))
  mkdirp.mkdirpSync(path.resolve('public/upload/img'))
}
