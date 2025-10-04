/* eslint-disable no-console */
import express from 'express'
import exitHook from 'exit-hook'
import cors from 'cors' // 👈 Thêm dòng này
import bcrypt from 'bcrypt'            // 👈 thêm bcrypt để mã hoá mật khẩu
import { CLOSE_DB, CONNECT_DB, GET_DB } from '~/config/mongodb' // 👈 thêm GET_DB
import { env } from '~/config/environment'
import { API_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

// 👇 Thêm hàm tạo admin mặc định
async function createDefaultAdmin() {
  try {
    const db = GET_DB()
    const users = db.collection('users')

    const exist = await users.findOne({ username: 'admin' })
    if (!exist) {
      const hashedPassword = await bcrypt.hash('admin', 10)
      await users.insertOne({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
        createdAt: Date.now()
      })
      console.log('✅ Đã tạo tài khoản admin mặc định (username/password: admin)')
    } else {
      console.log('ℹ️ Tài khoản admin đã tồn tại, bỏ qua.')
    }
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản admin mặc định:', error)
  }
}

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
  .then(async () => {
    console.log('Connected to MongoDB Cloud Atlas!')
    await createDefaultAdmin() // 👈 Gọi hàm tạo admin tại đây
  })
  .then(() => START_SEVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })
