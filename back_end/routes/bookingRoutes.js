const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  bookEvent,
  getMyBookings,
  getEventBookings,
  cancelBooking
} = require("../controllers/bookingController");

// CREATE BOOKING
router.post("/:eventId", auth, bookEvent);

// USER BOOKINGS
router.get("/my", auth, getMyBookings);

// ADMIN: EVENT BOOKINGS
router.get("/event/:eventId", auth, getEventBookings);

// CANCEL BOOKING (USER)
router.delete("/:id", auth, cancelBooking);

module.exports = router;
