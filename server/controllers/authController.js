const otpUtil = require('../utils/otp');
const mailer = require('../utils/mailer');
const User = require('../models/User'); // Mongoose model for registered users
const OtpStore = require('../models/OtpStore'); // Temporary storage for OTPs
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const OTP_EXPIRY_MINUTES = 5;

// 1️⃣ Signup Request OTP
exports.signupRequestOtp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'Email already registered' });
        }

        // Generate OTP
        const otp = otpUtil.generateOtp();
        
        // Save OTP in temporary store with expiry
        await OtpStore.findOneAndUpdate(
            { email },
            { otp, data: { name, password: await bcrypt.hash(password, 10) }, expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60000 },
            { upsert: true, new: true }
        );

        // Send OTP email
        await mailer.sendOtp(email, otp);

        res.json({ success: true, msg: 'OTP sent to your email for verification' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// 2️⃣ Signup Verify OTP
exports.signupVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpEntry = await OtpStore.findOne({ email });

        if (!otpEntry) return res.status(400).json({ success: false, msg: 'OTP not found or expired' });
        if (otpEntry.expiresAt < Date.now()) return res.status(400).json({ success: false, msg: 'OTP expired' });
        if (otpEntry.otp !== otp) return res.status(400).json({ success: false, msg: 'Invalid OTP' });

        // Create new user
        const { name, password } = otpEntry.data;
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Remove OTP entry after success
        await OtpStore.deleteOne({ email });

        // Create JWT token
        const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// 3️⃣ Signin Request OTP
exports.signinRequestOtp = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid credentials' });

        // Generate OTP
        const otp = otpUtil.generateOtp();

        await OtpStore.findOneAndUpdate(
            { email },
            { otp, data: { userId: user._id }, expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60000 },
            { upsert: true, new: true }
        );

        await mailer.sendOtp(email, otp);

        res.json({ success: true, msg: 'OTP sent to your email for login' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// 4️⃣ Signin Verify OTP
exports.signinVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpEntry = await OtpStore.findOne({ email });

        if (!otpEntry) return res.status(400).json({ success: false, msg: 'OTP not found or expired' });
        if (otpEntry.expiresAt < Date.now()) return res.status(400).json({ success: false, msg: 'OTP expired' });
        if (otpEntry.otp !== otp) return res.status(400).json({ success: false, msg: 'Invalid OTP' });

        const user = await User.findById(otpEntry.data.userId);

        await OtpStore.deleteOne({ email });

        const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// 5️⃣ Request Password Reset OTP
exports.requestResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: 'User not found' });

        const otp = otpUtil.generateOtp();

        await OtpStore.findOneAndUpdate(
            { email },
            { otp, data: { userId: user._id }, expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60000 },
            { upsert: true, new: true }
        );

        await mailer.sendOtp(email, otp);

        res.json({ success: true, msg: 'OTP sent for password reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};
