import { StatusCodes } from 'http-status-codes'
import { paymentService } from '~/services/paymentService'

const createNew = async (req, res, next) => {
  try {
    const result = await paymentService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const result = await paymentService.getAll()
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const result = await paymentService.getById(req.params.id)
    if (!result) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Payment not found' })
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export const paymentController = { createNew, getAll, getById }
