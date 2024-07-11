import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import BOOKMARK_MESSAGE from '~/constants/BookMarkMessage'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/errors'
import { validate } from '~/utils/validate'

export const checkValidateCreateBookmark = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: (value) => {
            if (value === null || value === undefined || value === '' || !ObjectId.isValid(value)) {
              throw new ErrorWithStatus(BOOKMARK_MESSAGE.TWEET_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      }
    },
    []
  )
)
