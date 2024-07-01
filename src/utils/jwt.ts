import jwt from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.PRIVATE_KEY as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = (token: string, privateKey: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        throw reject(err)
      }
      resolve(decoded)
    })
  })
}
