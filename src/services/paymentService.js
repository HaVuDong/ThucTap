import { paymentModel } from '~/models/paymentModel'

const createNew = async (data) => await paymentModel.createNew(data)
const getAll = async () => await paymentModel.getAll()
const getById = async (id) => await paymentModel.findOneById(id)

export const paymentService = { createNew, getAll, getById }
