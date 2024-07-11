import { Router } from 'express'
import { createTweetController } from '~/controllers/tweet.controllers'
import { checkValidateCreateTweet } from '~/middlewares/Tweet.middlewares'
import { checkValidateAccessToken, checkValidateVerifiedUser } from '~/middlewares/User.middleware'
import { wrapperRequestHandler } from '~/utils/handleError'

const tweetRouter = Router()
tweetRouter.post(
  '/create',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidateCreateTweet,
  wrapperRequestHandler(createTweetController)
)
export default tweetRouter
