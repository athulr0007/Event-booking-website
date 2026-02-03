const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },

    // 🔑 REQUIRED FOR REVENUE
    priceAtBooking: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// 🔒 ONE USER + ONE EVENT
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
