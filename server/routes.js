// server/routes.js
const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');

router.post('/signup-request-otp', authController.signupRequestOtp);
router.post('/signup-verify-otp', authController.signupVerifyOtp);
router.post('/signin-request-otp', authController.signinRequestOtp);
router.post('/signin-verify-otp', authController.signinVerifyOtp);
router.post('/request-reset-otp', authController.requestResetOtp);

module.exports = router;
