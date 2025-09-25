import { bookingModel } from '~/models/bookingModel.js'
import { fieldModel } from '~/models/fieldModel'

const calculateHours = (start, end) => {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em - (sh * 60 + sm)) / 60
}

const createNew = async (data) => {
  const field = await fieldModel.findOneById(data.fieldId)
  if (!field) throw new Error('Field not found')

  // Kiểm tra trùng giờ
  const overlap = await bookingModel.findOverlap(data.fieldId, data.bookingDate, data.startTime, data.endTime)
  if (overlap) throw new Error('Time slot already booked')

  // Tính số giờ
  const hours = calculateHours(data.startTime, data.endTime)
  if (hours < 1) throw new Error('Booking must be at least 1 hour')
  if ((hours * 60) % 30 !== 0) throw new Error('Booking must be in 30-minute steps')

  // Tính tổng tiền
  const totalPrice = field.pricePerHour * hours
  const requiredDeposit = totalPrice * 0.3

  // Nếu khách trả cọc >= 30% thì xác nhận ngay, nếu không thì chờ admin duyệt
  const isDeposited = data.depositAmount && data.depositAmount >= requiredDeposit

  return await bookingModel.createNew({
    ...data,
    totalPrice,
    depositAmount: data.depositAmount || 0,
    isDeposited,
    status: isDeposited ? 'confirmed' : 'pending'
  })
}

const cancelBooking = async (id) => {
  const booking = await bookingModel.findOneById(id)
  if (!booking) throw new Error('Booking not found')

  // Tính thời gian còn lại (ms)
  const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}:00`)
  const now = new Date()
  const diffHours = (bookingDateTime - now) / (1000 * 60 * 60)

  let statusUpdate = 'cancelled_no_refund'
  let refundAmount = 0

  if (diffHours >= 24 && booking.isDeposited) {
    statusUpdate = 'cancelled_refunded'
    refundAmount = booking.depositAmount
    // 🚀 Ở đây có thể gọi service thanh toán để hoàn tiền
  }

  const updated = await bookingModel.updateOne(id, {
    status: statusUpdate,
    refundAmount,
    updatedAt: Date.now()
  })

  return {
    ...updated,
    refundAmount
  }
}

const getById = async (id) => await bookingModel.findOneById(id)
const getAll = async () => await bookingModel.getAll()
const update = async (id, data) => await bookingModel.updateOne(id, data)
const remove = async (id) => await bookingModel.deleteOne(id)

export const bookingService = {
  createNew,
  getById,
  getAll,
  update,
  remove,
  cancelBooking
}
