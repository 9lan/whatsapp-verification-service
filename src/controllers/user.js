const express = require('express')
const { client } = require('../configs/wa-client')
const { formatPhoneNumber, checkRegisteredNumber, generateOTP } = require('../helpers')

const app = express()

const UserController = {
	register: async (req, res) => {
		const { phoneNumber } = req.body
	
		const userPhoneNumber = formatPhoneNumber(phoneNumber)
		const isRegisteredNumber = await checkRegisteredNumber(userPhoneNumber)
	
		if (!isRegisteredNumber) {
			return res.status(422).json({
				status: false,
				message: 'The number is not registered'
			})
		}
	
		const otpCode = `Your OTP code is ${generateOTP()}`
	
		client.sendMessage(userPhoneNumber, otpCode)
			.then((response) => {
				app.set('otpCode', otpCode)
				res.status(201).json({
					status: true,
					message: response
				})
			})
			.catch((err) => {
				res.status(500).json({
					status: false,
					message: err.message
				})
			})
	},
	verifyOTP: async (req, res) => {
		const getOTP = app.get('otpCode')
		const OTP = getOTP.replace('Your OTP code is ', '')

		const { OTPCode } = req.body

		if (OTPCode === OTP) {
			res.status(200).json({
				status: true,
				message: 'You are now verified!'
			})
		} else {
			res.status(403).json({
				status: false,
				message: 'Wrong OTP Code!'
			})
		}
	}
}

module.exports = UserController