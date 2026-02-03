const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile
} = require("../controllers/userController");

console.log("USER ROUTES LOADED");

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);

module.exports = router;
