const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


const {
  getUsers,
  getBookingsSummary,
  getDashboardStats,
  getRevenueAnalytics
} = require("../controllers/adminController");


router.get("/users", auth, admin, getUsers);
router.get("/bookings-summary", auth, admin, getBookingsSummary);
router.get("/dashboard-stats", auth, admin, getDashboardStats);
router.get("/revenue", auth, admin, getRevenueAnalytics);

module.exports = router;
