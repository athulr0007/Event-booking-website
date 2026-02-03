const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const transporter = require("../utils/mailer");

const otpStore = {}; // { email: { otp, expires } }

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔐 GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 mins
    };

    // 📧 SEND OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`
    });

    return res.json({
      msg: "OTP sent to email",
      step: "OTP_REQUIRED"
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

/* ---------------- OTP VERIFY (STEP 2) ---------------- */
exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ msg: "OTP not found" });
  }

  if (record.expires < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  delete otpStore[email];

  const user = await User.findOne({ email });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    }
  });
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    });

    res.json({
      msg: "User registered",
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Registration failed" });
  }
};
