const Event = require("../models/Event");

/* GET ALL EVENTS */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch events" });
  }
};

/* GET SINGLE EVENT */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch event" });
  }
};

/* CREATE EVENT (ADMIN) */
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create event" });
  }
};

/* UPDATE EVENT (ADMIN) */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update event" });
  }
};

/* DELETE EVENT (ADMIN) */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete event" });
  }
};
