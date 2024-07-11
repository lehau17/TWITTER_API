import express from 'express'
import userRouter from './user.route'
import mediaRouter from './media.route'
import tweetRouter from './Tweet.route'
import likeRouter from './Like.route'
import bookMarkRouter from './Bookmark.route'

const rootRouter = express.Router()

rootRouter.use('/user', userRouter)
rootRouter.use('/medias', mediaRouter)
rootRouter.use('/tweets', tweetRouter)
rootRouter.use('/likes', likeRouter)
rootRouter.use('/bookmarks', bookMarkRouter)

export default rootRouter
