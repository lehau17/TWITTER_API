import { config } from 'dotenv'
config()

export const isProduction = () => {
  return process.argv.indexOf('--dev') === -1
}
