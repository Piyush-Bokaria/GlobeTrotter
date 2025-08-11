const mongoose = require('mongoose');

const otpStoreSchema = new mongoose.Schema({
    email: String,
    otp: String,
    data: Object,
    expiresAt: Date
});

module.exports = mongoose.model('OtpStore', otpStoreSchema);
