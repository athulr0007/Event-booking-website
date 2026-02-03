const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.bookEvent = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: "Invalid quantity" });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (new Date(event.bookingCloseAt) <= new Date()) {
      return res.status(400).json({ msg: "Booking closed" });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({ msg: "Not enough seats" });
    }

    let booking = await Booking.findOne({
      user: req.user,
      event: event._id
    });

    if (booking) {
      booking.quantity += quantity;
      await booking.save();
    } else {
      booking = await Booking.create({
        user: req.user,
        event: event._id,
        quantity,
        priceAtBooking: event.price
      });
    }

    event.availableSeats -= quantity;
    await event.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Booking failed" });
  }
};


// USER: my bookings
exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user }).populate("event");
  res.json(bookings);
};

// ADMIN: bookings per event
exports.getEventBookings = async (req, res) => {
  const bookings = await Booking.find({ event: req.params.eventId })
    .populate("user", "name email");
  res.json(bookings);
};

// CANCEL BOOKING (PARTIAL OR FULL)
exports.cancelBooking = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: "Invalid quantity" });
    }

    if (quantity > booking.quantity) {
      return res.status(400).json({ msg: "Exceeds booked seats" });
    }

    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: quantity }
    });

    if (quantity === booking.quantity) {
      await booking.deleteOne();
    } else {
      booking.quantity -= quantity;
      await booking.save();
    }

    res.json({ msg: "Booking updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cancel failed" });
  }
};
