import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import TWEET_MESSAGE from '~/constants/TweetMessage'
import { ErrorWithStatus } from '~/models/errors'
import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import { enumToArray } from '~/utils/commons'
import { validate } from '~/utils/validate'
const arrTweetType = enumToArray(TweetType)
const arrTweetAudience = enumToArray(TweetAudience)
export const checkValidateCreateTweet = validate(
  checkSchema(
    {
      type: {
        isEmpty: false,
        custom: {
          options: (value, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus(TWEET_MESSAGE.TWEETTYPE_NOT_EMPTY, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            const exist = arrTweetType.findIndex((t) => t === value)

            if (exist === -1) {
              throw new ErrorWithStatus(TWEET_MESSAGE.TWEETTYPE_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      audience: {
        custom: {
          options: (value, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus(TWEET_MESSAGE.AUDIENCE_NOT_EMPTY, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            const exist = arrTweetAudience.findIndex((t) => t === value)
            if (exist === -1) {
              throw new ErrorWithStatus(TWEET_MESSAGE.AUDIENCE_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const { type } = req.body
            if (
              [TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].some((t) => t === type) &&
              ObjectId.isValid(value)
            ) {
              return true
            }
            if ([TweetType.Retweet].every((t) => t === type) && value === null) {
              return true
            }

            throw new ErrorWithStatus(TWEET_MESSAGE.TWEET_TYPE_AND_PARENT_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
        }
      },
      content: {
        custom: {
          options: (value, { req }) => {
            const { type, mentions, hashtags } = req.body as CreateTweetReqBody
            if ([TweetType.Retweet].every((t) => t === type) && value === '') {
              return true
            }
            if (
              [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].some((t) => t === type) &&
              mentions.length === 0 &&
              hashtags.length === 0 &&
              typeof value === 'string' &&
              value !== ''
            ) {
              return true
            }

            throw new ErrorWithStatus(TWEET_MESSAGE.CONTENT_IS_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!value.every((item: any) => typeof item === 'string')) {
              throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value) => {
            if (value.length === 0) return true
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value) => {
            if (value.length === 0) return true

            // if (!value.every((item: any) => typeof item === )) {
            //   throw new ErrorWithStatus(TWEET_MESSAGE.HASHTAG_IS_NOT_ARRAY_STRING, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            // }
            return true
          }
        }
      }
    },

    ['body']
  )
)
