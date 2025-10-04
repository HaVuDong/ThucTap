import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'

const register = async (data) => {
  const cleanEmail = data.email?.trim().toLowerCase()
  const cleanUsername = data.username?.trim()

  if (!cleanEmail || !data.password) throw new Error('Thiếu dữ liệu')

  const exist = await userModel.findByEmail(cleanEmail)
  if (exist) throw new Error('Email already registered')

  const hashedPassword = await bcrypt.hash(data.password, 10)
  const result = await userModel.createNew({
    username: cleanUsername,
    email: cleanEmail,
    password: hashedPassword,
    role: data.role || 'user',
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  return { id: result.insertedId, email: cleanEmail, role: data.role || 'user' }
}

const login = async ({ identifier, password }) => {
  // Cho phép nhập username hoặc email
  const loginInput = identifier?.trim().toLowerCase()
  if (!loginInput || !password) throw new Error('Thiếu username/email hoặc mật khẩu')

  // Tìm user theo email hoặc username
  const user =
    (await userModel.findByEmail(loginInput)) ||
    (await userModel.findByUsername(loginInput))

  if (!user) throw new Error('User not found')

  // So sánh mật khẩu
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Sai mật khẩu')

  // Tạo token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return {
    token,
    user: { id: user._id, email: user.email, username: user.username, role: user.role }
  }
}

export const userService = { register, login }
