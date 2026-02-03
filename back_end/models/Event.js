const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  location: String,
  category: String,
  description: String,
  availableSeats: Number,
  price: Number,
  thumbnail: String,

  bookingCloseAt: {
    type: Date,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Event", eventSchema);
