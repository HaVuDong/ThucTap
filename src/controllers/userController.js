import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const user = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: user })
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll()
    res.status(StatusCodes.OK).json({ success: true, data: users })
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id)
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' })
    res.status(StatusCodes.OK).json({ success: true, data: user })
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const updatedUser = await userService.update(req.params.id, req.body)
    if (!updatedUser) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' })
    res.status(StatusCodes.OK).json({ success: true, data: updatedUser })
  } catch (error) { next(error) }
}

const remove = async (req, res, next) => {
  try {
    const deleted = await userService.remove(req.params.id)
    if (!deleted || deleted.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' })
    }
    res.status(StatusCodes.OK).json({ success: true, message: 'User deleted successfully' })
  } catch (error) { next(error) }
}

export const userController = { createNew, getAll, getById, update, remove }
