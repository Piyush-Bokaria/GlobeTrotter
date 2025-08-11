const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpStore = require('../models/OtpStore');
const { generateOtp } = require('../utils/otp');
const { sendOtp } = require('../utils/mailer');

// Signup request OTP
router.post('/signup-request-otp', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Remove any existing OTP for this email
    await OtpStore.deleteOne({ email });

    // Save OTP to database with expiration
    const otpEntry = new OtpStore({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    await otpEntry.save();

    // Send OTP to user's email
    const mailResult = await sendOtp(email, otp);
    if (!mailResult.success) {
      console.error('Error sending OTP:', mailResult.error);
      return res.status(500).json({ msg: 'Failed to send OTP. Please check server logs.' });
    }

    res.json({ success: true, msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in signup-request-otp route:', err);
    res.status(500).json({ msg: 'An error occurred. Please try again.' });
  }
});

// Signup verify OTP
router.post('/signup-verify-otp', async (req, res) => {
  try {
    const { email, password, name, otp } = req.body;

    // Verify OTP
    const otpEntry = await OtpStore.findOne({ email, otp, expiresAt: { $gt: new Date() } });
    if (!otpEntry) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Delete the used OTP
    await OtpStore.deleteOne({ email, otp });

    // Return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'secret', // Replace with your actual secret
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'An error occurred during verification.' });
  }
});

// Signin request OTP
router.post('/signin-request-otp', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Remove any existing OTP for this email
    await OtpStore.deleteOne({ email });

    // Save OTP to database with expiration
    const otpEntry = new OtpStore({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    await otpEntry.save();

    // Send OTP to user's email
    const mailResult = await sendOtp(email, otp);
    if (!mailResult.success) {
      console.error('Error sending OTP:', mailResult.error);
      return res.status(500).json({ msg: 'Failed to send OTP. Please check server logs.' });
    }

    res.json({ success: true, msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in signin-request-otp route:', err);
    res.status(500).json({ msg: 'An error occurred. Please try again.' });
  }
});

// Signin verify OTP
router.post('/signin-verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP
    const otpEntry = await OtpStore.findOne({ email, otp, expiresAt: { $gt: new Date() } });
    if (!otpEntry) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Delete the used OTP
    await OtpStore.deleteOne({ email, otp });

    // Return JWT
    const user = await User.findOne({ email });
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'secret', // Replace with your actual secret
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'An error occurred during verification.' });
  }
});
// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    // For now, we'll just log the email to the console.
    // In a real application, you would generate a reset token and send an email.
    console.log(`Password reset requested for email: ${email}`);
    res.json({ msg: 'If a user with that email exists, a password reset link has been sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;