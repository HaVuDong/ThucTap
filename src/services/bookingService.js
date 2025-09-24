import { bookingModel } from '~/models/bookingModel.js'
import { fieldModel } from '~/models/fieldModel'

const calculateHours = (start, end) => {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em - (sh * 60 + sm)) / 60
}

const createNew = async (data) => {
  // 1. Check sân tồn tại
  const field = await fieldModel.findOneById(data.fieldId)
  if (!field) throw new Error('Field not found')

  // 2. Check trùng giờ
  const overlap = await bookingModel.findOverlap(data.fieldId, data.bookingDate, data.startTime, data.endTime)
  if (overlap) throw new Error('Time slot already booked')

  // 3. Tính tiền
  const hours = calculateHours(data.startTime, data.endTime)
  const totalPrice = field.pricePerHour * hours

  // 4. Tạo booking
  return await bookingModel.createNew({
    ...data,
    totalPrice,
    status: 'pending'
  })
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
  remove
}
