import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/userMessage'

//không kế thừa error vì error chỉ mặt định lấy ra mesgase
type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export class ErrorWithStatus {
  message: string
  status: number
  constructor(message: string, status: number) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  error: ErrorType
  constructor(error: ErrorType) {
    super(USER_MESSAGE.VALIDATE_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY)
    this.error = error
  }
}
