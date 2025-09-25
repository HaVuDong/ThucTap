/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const USER_COLLECTION_NAME = 'users'

export const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
}

const findOneById = async (id) => {
  const queryId = ObjectId.isValid(id) ? new ObjectId(id) : null
  if (!queryId) return null
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: queryId })
}

const findByEmail = async (email) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
}

export const userModel = {
  createNew,
  findOneById,
  findByEmail
}
