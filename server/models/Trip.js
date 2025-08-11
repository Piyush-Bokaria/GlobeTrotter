import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    
    name: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coverPhoto: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "ongoing", "completed", "cancelled"],
      default: "planning",
    },
    budget: Number,
    destination: String,
  },
  { timestamps: true }
);
// Validate that end date is after start date
tripSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error("End date must be after start date"));
  } else {
    next();
  }
});

// Also validate on update operations
tripSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.startDate && update.endDate) {
    const startDate = new Date(update.startDate);
    const endDate = new Date(update.endDate);
    if (endDate <= startDate) {
      next(new Error("End date must be after start date"));
    } else {
      next();
    }
  } else {
    next();
  }
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
