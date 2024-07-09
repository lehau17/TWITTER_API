import express from 'express'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import path from 'path'
import rootRouter from '~/routes/root.route'

//setting server
const app = express()
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))
app.use(express.json())
app.use('/api', rootRouter)
//
//
//connect database service
databaseService.connect()
//middleware
app.use(defaultErrorHandler)
// listening server
const port = 3001
app.listen(port, () => {
  console.log(`App listening on ${port}`)
})
