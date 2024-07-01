import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'
type filterKeys<T> = Array<keyof T>

export const filterFieldMidderware = <T>(arrFields: filterKeys<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, arrFields)
    next()
  }
}
