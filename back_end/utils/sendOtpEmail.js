const nodemailer = require("nodemailer");

module.exports = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OTP_EMAIL,
      pass: process.env.OTP_EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Event Crowd" <${process.env.OTP_EMAIL}>`,
    to: email,
    subject: "Your Login OTP",
    html: `
      <h2>Login OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `
  });
};
