import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.route('/')
  .get(paymentController.getAll)
  .post(paymentController.createNew)

Router.route('/:id')
  .get(paymentController.getById)

export const paymentsRoute = Router
