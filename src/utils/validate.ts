import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/errors'

// can be reused by many routes
export const validate = (schema: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // run checkSchema function to validate
    await schema.run(req)
    const error = validationResult(req)
    const errorObject = error.mapped()
    //create error object validate
    const entityError = new EntityError({})
    // quy định dạng lỗi
    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      } else {
        entityError.error[key] = errorObject[key]
      }
    }
    if (error.isEmpty()) {
      return next()
    }
    return res.json(errorObject)
  }
}
