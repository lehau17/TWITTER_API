import { createHash } from 'crypto'

const sha256 = (password: string) => {
  return createHash('sha256').update(password).digest('hex')
}

export const hashPassword = (password: string) => {
  return sha256(password)
}
