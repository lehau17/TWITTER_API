import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMG_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/userMessage'
import { mediaService } from '~/services/media.services'
import { uploadImg, uploadVideo } from '~/utils/files'

export const uploadSingleImgController = async (req: Request, res: Response) => {
  const data = await uploadImg(req, 1)
  const result = await mediaService.uploadImgService(data)
  res.json({ result, meg: USER_MESSAGE.UPLOAD_IMG_SUCCESS })
}

export const uploadMultiImgController = async (req: Request, res: Response) => {
  const files = await uploadImg(req, 4)
  const result = await mediaService.uploadImgService(files)
  res.json({ result, meg: USER_MESSAGE.UPLOAD_IMG_SUCCESS })
}

export const uploadSingleVideoController = async (req: Request, res: Response) => {
  const video = await uploadVideo(req, 1)
  const result = mediaService.uploadVideoService(video)
  console.log('check result', result)

  res.json({ result, meg: USER_MESSAGE.UPLOAD_VIDEO_SUCCESS })
}

export const serveImgController = (req: Request, res: Response) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMG_DIR, name), (err) => {
    if (err) {
      res.status(HTTP_STATUS.NOT_FOUND).send(err.message)
    }
  })
}

export const serveVideoController = (req: Request, res: Response) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      res.status(HTTP_STATUS.NOT_FOUND).send(err.message)
    }
  })
}
