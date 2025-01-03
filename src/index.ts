import express from 'express'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import path from 'path'
import rootRouter from '~/routes/root.route'
import staticRouter from './routes/static.route'
import { createPublicPath } from './utils/files'

//setting server
const app = express()
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))
app.use('/static', staticRouter)
createPublicPath()
app.use(express.json())
app.use('/api', rootRouter)
//
//
//connect database service
databaseService.connect().then(() => {
  databaseService.createIndexFollower()
  databaseService.createIndexRefreshToken()
  databaseService.createIndexUser()
})
//middleware
app.use(defaultErrorHandler)
// listening server
const port = 3001
app.listen(port, () => {
  console.log(`App listening on ${port}`)
})
