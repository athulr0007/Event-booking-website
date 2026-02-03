const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createCheckoutSession
} = require("../controllers/paymentController");

router.post("/checkout", auth, createCheckoutSession);

module.exports = router;
