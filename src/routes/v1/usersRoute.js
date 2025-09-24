import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/')
  .get(userController.getAll)
  .post(userController.createNew)

Router.route('/:id')
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.remove)

export const usersRoute = Router
