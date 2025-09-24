import { userModel } from '~/models/userModel'

const createNew = async (data) => await userModel.createNew(data)
const getAll = async () => await userModel.getAll()
const getById = async (id) => await userModel.findOneById(id)
const getByEmail = async (email) => await userModel.findByEmail(email)
const update = async (id, data) => await userModel.updateOne(id, data)
const remove = async (id) => await userModel.deleteOne(id)

export const userService = { createNew, getAll, getById, getByEmail, update, remove }
