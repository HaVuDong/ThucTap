/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable no-console */
import express from 'express'
import path from "path"
import exitHook from 'exit-hook'
import cors from 'cors' // 👈 Thêm dòng này
import bcrypt from 'bcrypt'            // 👈 thêm bcrypt để mã hoá mật khẩu
import { CLOSE_DB, CONNECT_DB, GET_DB } from '~/config/mongodb.js' // 👈 thêm GET_DB
import { env } from '~/config/environment.js'
import { API_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'

// 👇 Thêm hàm tạo admin mặc định


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

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  app.use("/v1/uploads", express.static(path.join(__dirname, "../uploads")));

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  const PORT = process.env.PORT || 8017

  app.listen(PORT, () => {
    console.log(`✅ Server running and listening on PORT ${PORT}`)
  })

  // cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down')
    CLOSE_DB()
    console.log('5. Disconnecting from MongoDB Cloud Atlas')
  })
}

CONNECT_DB()
  .then(async () => {
    console.log('Connected to MongoDB Cloud Atlas!')
  })
  .then(() => START_SEVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })
