import { Request, Response } from 'express'
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
  console.log('Check video', video)

  const result = await mediaService.uploadVideoService(video)
  res.json({ result, meg: USER_MESSAGE.UPLOAD_VIDEO_SUCCESS })
}
