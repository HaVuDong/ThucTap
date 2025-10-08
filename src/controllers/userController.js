/* eslint-disable quotes */
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

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll()
    res.status(StatusCodes.OK).json(users) // 🟢 trả mảng trực tiếp
  } catch (error) {
    next(error)
  }
}


const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id)
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" })
    }
    res.status(StatusCodes.OK).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const created = await userService.create(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: created })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const updated = await userService.update(req.params.id, req.body)
    if (!updated) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" })
    }
    res.status(StatusCodes.OK).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const deleted = await userService.remove(req.params.id)
    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" })
    }
    res.status(StatusCodes.OK).json({ success: true, message: "User deleted" })
  } catch (error) {
    next(error)
  }
}

export const userController = { register, login, getAll, getById, create, update, remove }
