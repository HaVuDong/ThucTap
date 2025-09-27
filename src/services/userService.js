import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'

const register = async (data) => {
    const exist = await userModel.findByEmail(data.email)
    if (exist) throw new Error('Email already registered')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const result = await userModel.createNew({ ...data, password: hashedPassword })

    return { id: result.insertedId, email: data.email, role: data.role || 'user' }
}

const login = async ({ email, password }) => {
    const user = await userModel.findByEmail(email)
    if (!user) throw new Error('User not found')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid credentials')

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    return { token, user: { id: user._id, email: user.email, role: user.role } }
}

export const userService = { register, login }
