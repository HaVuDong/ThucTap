import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { fieldsRoute } from '~/routes/v1/FieldsRoute'
import { bookingRoute } from '~/routes/v1/BookingsRoute'
import { customersRoute } from '~/routes/v1/customersRoute'
import { paymentsRoute } from '~/routes/v1/paymentsRoute'
import { usersRoute } from '~/routes/v1/usersRoute'
import { tournamentsRoute } from './tournamentsRoute'
import { promotionsRoute } from './promotionsRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1 are ready to use.' })
})

Router.use('/fields', fieldsRoute)
Router.use('/bookings', bookingRoute)
Router.use('/customers', customersRoute)
Router.use('/payments', paymentsRoute)
Router.use('/users', usersRoute)
Router.use('/tournaments', tournamentsRoute)
Router.use('/promotions', promotionsRoute)

export const API_V1 = Router
