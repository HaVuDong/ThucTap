import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { fieldsRoute } from '~/routes/v1/FieldsRoute'
import { bookingsRoute } from '~/routes/v1/BookingsRoute'
import { customersRoute } from '~/routes/v1/customersRoute'
import { paymentsRoute } from '~/routes/v1/paymentsRoute'
import { usersRoute } from '~/routes/v1/usersRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1 are ready to use.' })
})

Router.use('/fields', fieldsRoute)
Router.use('/bookings', bookingsRoute)
Router.use('/customers', customersRoute)
Router.use('/payments', paymentsRoute)
Router.use('/users', usersRoute)

export const API_V1 = Router
