import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const PAYMENT_COLLECTION_NAME = 'payments'
const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  bookingId: Joi.string().required(),
  customerId: Joi.string().required(),
  amount: Joi.number().required().min(0),
  method: Joi.string().valid('cash', 'credit', 'banking').required(),
  status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
  createdAt: Joi.date().timestamp().default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await PAYMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).insertOne({
    ...validData,
    bookingId: new ObjectId(validData.bookingId),
    customerId: new ObjectId(validData.customerId)
  })
  return result
}

const getAll = async () => {
  return await GET_DB().collection(PAYMENT_COLLECTION_NAME).find().toArray()
}

const findOneById = async (id) => {
  return await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

export const paymentModel = {
  PAYMENT_COLLECTION_NAME,
  createNew,
  getAll,
  findOneById
}
