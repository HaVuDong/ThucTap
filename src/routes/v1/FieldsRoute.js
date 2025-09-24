/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { fieldValidation } from '~/validations/fieldValidation'
import { fieldController } from '~/controllers/fieldController'
const Router = express.Router()

Router.route('/')
    .get(fieldController.getAll)
    .post(fieldValidation.createNew, fieldController.createNew)
Router.route('/:id')
    .get(fieldController.getById)
    .put(fieldController.update)
    .delete(fieldController.remove)

export const fieldsRoute = Router