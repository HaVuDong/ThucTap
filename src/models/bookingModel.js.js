/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const BOOKING_COLLECTION_NAME = 'bookings'
const BOOKING_COLLECTION_SCHEMA = Joi.object({
  fieldId: Joi.string().required(),
  customerId: Joi.string().required(),

  bookingDate: Joi.date().required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),

  totalPrice: Joi.number().min(0).required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').default('pending'),
  notes: Joi.string().max(500).allow('', null),

  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await BOOKING_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const result = await GET_DB().collection(BOOKING_COLLECTION_NAME).insertOne(validData)
  return result
}

const findOneById = async (id) => {
  const queryId = ObjectId.isValid(id) ? new ObjectId(id) : null
  if (!queryId) return null
  return await GET_DB().collection(BOOKING_COLLECTION_NAME).findOne({ _id: queryId })
}

const getAll = async () => {
  return await GET_DB().collection(BOOKING_COLLECTION_NAME).find().toArray()
}

const updateOne = async (id, data) => {
  const queryId = ObjectId.isValid(id) ? new ObjectId(id) : null
  if (!queryId) return null

  const result = await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: queryId },
      { $set: { ...data, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
  return result.value
}

const deleteOne = async (id) => {
  const queryId = ObjectId.isValid(id) ? new ObjectId(id) : null
  if (!queryId) return null
  return await GET_DB().collection(BOOKING_COLLECTION_NAME).deleteOne({ _id: queryId })
}

/** Check trùng giờ */
const findOverlap = async (fieldId, bookingDate, startTime, endTime) => {
  return await GET_DB().collection(BOOKING_COLLECTION_NAME).findOne({
    fieldId,
    bookingDate: new Date(bookingDate),
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ],
    status: { $in: ['pending', 'confirmed'] }
  })
}

export const bookingModel = {
  BOOKING_COLLECTION_NAME,
  BOOKING_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  updateOne,
  deleteOne,
  findOverlap
}
