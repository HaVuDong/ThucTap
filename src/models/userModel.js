import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import bcrypt from 'bcrypt'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(3).max(30).trim().strict(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('admin', 'manager', 'customer').default('customer'),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  // hash password trước khi lưu
  const hashedPassword = await bcrypt.hash(validData.password, 10)
  const userToInsert = { ...validData, password: hashedPassword }

  const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(userToInsert)
  return result
}

const findOneById = async (id) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

const findByEmail = async (email) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
}

const getAll = async () => {
  return await GET_DB().collection(USER_COLLECTION_NAME).find().toArray()
}

const updateOne = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10)
  }
  const result = await GET_DB().collection(USER_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
  return result.value
}

const deleteOne = async (id) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

export const userModel = {
  USER_COLLECTION_NAME,
  createNew,
  findOneById,
  findByEmail,
  getAll,
  updateOne,
  deleteOne
}
