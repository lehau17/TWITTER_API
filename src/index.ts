import express, { NextFunction, Request, Response } from 'express'
import databaseService from '~/services/database.services'
import rootRouter from './routes/root.route'
import { defaultErrorHandler } from './middlewares/error.middlewares'
//setting server
const app = express()
app.use(express.json())
app.use('/api', rootRouter)
//connect database service
databaseService.connect()
//middleware
app.use(defaultErrorHandler)
// listening server
const port = 1234
app.listen(port, () => {
  console.log(`App listening on ${port}`)
})
