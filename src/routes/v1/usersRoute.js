import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { isAdmin } from '~/middlewares/roleMiddleware'

const Router = express.Router()

Router.post('/register', userController.register)
Router.post('/login', userController.login)

// route thử quyền admin
Router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  res.json({ success: true, message: 'Welcome Admin!' })
})

export const usersRoute = Router
