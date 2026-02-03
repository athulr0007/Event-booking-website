require("dotenv").config();
const transporter = require("./utils/mailer");

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "OTP Test",
  text: "If you received this, email is working."
})
.then(() => console.log("MAIL SENT SUCCESSFULLY"))
.catch(err => console.error("MAIL ERROR:", err));
