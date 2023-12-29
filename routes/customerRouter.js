const express = require('express')
const customerController = require('../controllers/customers')

const customerRouter = express.Router()

customerRouter.post('/signup', customerController.signUp)
customerRouter.post('/signin', customerController.signIn)
customerRouter.post('/resetPwd', customerController.resetPwd)
customerRouter.post('/enterNewPwd', customerController.enterNewPwd)

module.exports = customerRouter;

