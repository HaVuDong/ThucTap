/* eslint-disable no-console */
import express from 'express'
import exitHook from 'exit-hook'
import cors from 'cors' // 👈 Thêm dòng này
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { API_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SEVER = () => {
  const app = express()

  app.use(express.json())

  // 👇 Thêm middleware CORS
  app.use(cors({
    origin: 'http://localhost:3000', // domain frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }))

  // Mount API v1
  app.use('/v1', API_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. hi ${env.AUTHOR}, Hello Dong Dev, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down')
    CLOSE_DB()
    console.log('5. Disconnecting from MongoDB Cloud Atlas')
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
  .then(() => START_SEVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })
