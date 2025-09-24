/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { fieldService } from '~/services/fieldService'

const createNew = async (req, res, next) => {
  try {
    const created = await fieldService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: created })
    console.log(created)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const fields = await fieldService.getAll()
    res.status(StatusCodes.OK).json({ success: true, data: fields })
    console.log(fields)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const field = await fieldService.getById(req.params.id)
    if (!field) {
      const notFoundError = new Error('Field not found')
      notFoundError.statusCode = StatusCodes.NOT_FOUND
      throw notFoundError
    }
    res.status(StatusCodes.OK).json({ success: true, data: field })
    console.log(field)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const updatedField = await fieldService.update(req.params.id, req.body)

    if (!updatedField) {
      // ❌ check null chậm lại ở cuối
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Field not found'
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedField
    })
  } catch (error) {
    next(error)
  }
}


const remove = async (req, res, next) => {
  try {
    const deleted = await fieldService.remove(req.params.id)
    if (!deleted || deleted.deletedCount === 0) {
      const notFoundError = new Error('Field not found')
      notFoundError.statusCode = StatusCodes.NOT_FOUND
      throw notFoundError
    }
    res.status(StatusCodes.OK).json({ success: true, message: 'Field deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const fieldController = {
  createNew,
  getAll,
  getById,
  update,
  remove
}
