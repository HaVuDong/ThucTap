import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.status(StatusCodes.OK).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

export const userController = { register, login }
