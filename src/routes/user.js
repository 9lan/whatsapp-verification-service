const express = require('express')

const { UserController } = require('../controllers')

const router = express.Router()

router
	.post('/register', UserController.register)
	.post('/verify-otp', UserController.verifyOTP)

module.exports = router