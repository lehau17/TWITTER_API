import { Router } from 'express'
import { createTweetController, getChildrenTweet, getNewFeeds, getTweetById } from '~/controllers/tweet.controllers'
import { checkValidateIsLogin, checkValidateTweetId } from '~/middlewares/bookmark.middlewares'
import {
  checkValidateAudience,
  checkValidateCreateTweet,
  checkValidatePagination,
  checkValidateTypeTweet
} from '~/middlewares/Tweet.middlewares'
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

tweetRouter.get(
  '/:tweet_id',
  checkValidateIsLogin(checkValidateAccessToken),
  checkValidateIsLogin(checkValidateVerifiedUser),
  checkValidateTweetId,
  wrapperRequestHandler(checkValidateAudience),
  wrapperRequestHandler(getTweetById)
)

tweetRouter.get(
  '/:tweet_id/children',
  checkValidateIsLogin(checkValidateAccessToken),
  checkValidateIsLogin(checkValidateVerifiedUser),
  checkValidateTweetId,
  checkValidatePagination,
  checkValidateTypeTweet,
  wrapperRequestHandler(checkValidateAudience),
  wrapperRequestHandler(getChildrenTweet)
)

tweetRouter.get(
  '/',
  checkValidateAccessToken,
  checkValidateVerifiedUser,
  checkValidatePagination,
  wrapperRequestHandler(getNewFeeds)
)
export default tweetRouter
