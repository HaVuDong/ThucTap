import express from 'express'
import { bookingController } from '~/controllers/bookingController'

const Router = express.Router()

Router.route('/')
  .get(bookingController.getAll)
  .post(bookingController.createNew)

Router.route('/:id')
  .get(bookingController.getById)
  .put(bookingController.update)
  .delete(bookingController.remove)

export const bookingsRoute = Router
