const router = require("express").Router();
const {
  login,
  register,
  verifyLoginOtp
} = require("../controllers/authController");

router.post("/login", login);
router.post("/login/otp", verifyLoginOtp);
router.post("/register", register);

module.exports = router;
