import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    coverPhoto: {
        type: String, 
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'cancelled'],
        default: 'planning'
    },
    budget: {
        type: Number,
        default: 0
    },
    destination: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Validate that end date is after start date
tripSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    } else {
        next();
    }
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;