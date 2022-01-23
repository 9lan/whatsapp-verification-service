const generateOTP = () => {
	var nums = '0123456789';
	let OTP = '';
	for (let i = 0; i < 4; i++ ) {
			OTP += nums[Math.floor(Math.random() * 10)];
	}
	return OTP;
}

module.exports = generateOTP