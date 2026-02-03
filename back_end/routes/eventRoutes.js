const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

/* PUBLIC */
router.get("/", getEvents);
router.get("/:id", getEventById);

/* ADMIN */
router.post("/", auth, admin, createEvent);
router.put("/:id", auth, admin, updateEvent);
router.delete("/:id", auth, admin, deleteEvent);

module.exports = router;
