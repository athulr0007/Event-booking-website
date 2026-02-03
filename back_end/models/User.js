const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },

  // 🔐 OTP FIELDS
  loginOtp: String,
  otpExpiresAt: Date
});

module.exports = mongoose.model("User", userSchema);
