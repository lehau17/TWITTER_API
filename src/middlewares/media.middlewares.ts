// import { NextFunction, Request, Response } from 'express'
// import core from 'express-serve-static-core'
// import formidable from 'formidable'
// import { MediaUploadImgReqBody } from '~/models/requests/Media.request'

// export const uploadImgMiddleware = (
//   req: Request<core.ParamsDictionary, any, any>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const form = formidable({
//     keepExtensions: true,
//     allowEmptyFiles: false,
//     maxFileSize: 1024 * 1024 * 200,
//     filter: ({ name, originalFilename, mimetype }) => {
//       let cancelUploads = false
//       const valid = mimetype && mimetype.includes('image')
//       if (!valid) {
//         form.emit('error' as any, new Error('Loi r') as any) // optional make form.parse error
//         cancelUploads = true //variable to make filter return false after the first problem
//       }
//       return Boolean(valid && !cancelUploads)
//     }
//   })

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return next(err)
//   })
// }
