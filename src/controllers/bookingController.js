import { StatusCodes } from 'http-status-codes'
import { bookingService } from '~/services/bookingService'

const createNew = async (req, res, next) => {
  try {
    const newBooking = await bookingService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: newBooking })
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAll()
    res.status(StatusCodes.OK).json({ success: true, data: bookings })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const booking = await bookingService.getById(req.params.id)
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Booking not found' })
    }
    res.status(StatusCodes.OK).json({ success: true, data: booking })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const updated = await bookingService.update(req.params.id, req.body)
    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Booking not found' })
    }
    res.status(StatusCodes.OK).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const deleted = await bookingService.remove(req.params.id)
    if (!deleted || deleted.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Booking not found' })
    }
    res.status(StatusCodes.OK).json({ success: true, message: 'Booking deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const cancel = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id)
    res.status(StatusCodes.OK).json({
      success: true,
      message: result.refundAmount > 0
        ? `Booking cancelled, refunded ${result.refundAmount}`
        : 'Booking cancelled, no refund',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const bookingController = {
  createNew,
  getAll,
  getById,
  update,
  remove,
  cancel
}
