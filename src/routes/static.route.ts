import express from 'express'
import { serveImgController, serveVideoController } from '~/controllers/media.controllers'

const staticRouter = express.Router()

staticRouter.get('/img/:name', serveImgController)
staticRouter.get('/video/:name', serveVideoController)

export default staticRouter
