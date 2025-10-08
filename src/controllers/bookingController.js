/* eslint-disable no-console */
/* eslint-disable quotes */
import { StatusCodes } from "http-status-codes"
import { bookingService } from "~/services/bookingService"

const createNew = async (req, res, next) => {
  try {
    const newBooking = await bookingService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ success: true, data: newBooking })
  } catch (error) {
    console.error("❌ createNew error:", error.message)
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message })
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
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found"
      })
    }
    res.status(StatusCodes.OK).json({ success: true, data: booking })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params // ✅ Lấy id hợp lệ từ URL
    console.log("🧩 PUT /bookings/:id nhận ID:", id)

    const updated = await bookingService.update(id, req.body)

    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found"
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking updated successfully",
      data: updated
    })
  } catch (error) {
    console.error("❌ update booking error:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error updating booking"
    })
  }
}


const remove = async (req, res, next) => {
  try {
    const deleted = await bookingService.remove(req.params.id)
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found"
      })
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Booking deleted successfully" })
  } catch (error) {
    next(error)
  }
}

const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id
    const result = await bookingService.cancelBooking(bookingId, "user")
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found"
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const adminCancelBooking = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await bookingService.cancelBooking(id, "admin")
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found"
      })
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking cancelled by admin",
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
  cancelBooking,
  adminCancelBooking
}
