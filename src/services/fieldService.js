/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import { fieldModel } from '~/models/fieldModel'

const createNew = async (reqBody) => {
  try {
    return await fieldModel.createNew(reqBody)
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  return await fieldModel.getAll()
}

const getById = async (id) => {
  return await fieldModel.findOneById(id)
}

const update = async (id, reqBody) => {
  return await fieldModel.updateOne(id, reqBody)
}

const remove = async (id) => {
  return await fieldModel.deleteOne(id)
}

export const fieldService = {
  createNew,
  getAll,
  getById,
  update,
  remove
}
