import express from 'express'
import userRouter from './user.route'
import mediaRouter from './media.route'

const rootRouter = express.Router()

rootRouter.use('/user', userRouter)
rootRouter.use('/medias', mediaRouter)
export default rootRouter
