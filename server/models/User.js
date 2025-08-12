import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    otp: String,
    otpExpires: Date,
}, {
    timestamps: true
});

// Update name field when firstName or lastName changes
userSchema.pre('save', function(next) {
    if (this.firstName && this.lastName) {
        this.name = `${this.firstName} ${this.lastName}`;
    }
    next();
});

const User = mongoose.model('Users', userSchema);

export default User;