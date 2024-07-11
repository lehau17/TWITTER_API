import express from 'express'
import userRouter from './user.route'
import mediaRouter from './media.route'
import tweetRouter from './Tweet.route'

const rootRouter = express.Router()

rootRouter.use('/user', userRouter)
rootRouter.use('/medias', mediaRouter)
rootRouter.use('/tweets', tweetRouter)
export default rootRouter
