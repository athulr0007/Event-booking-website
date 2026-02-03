const User = require("../models/User");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

/* ---------------- USERS LIST ---------------- */
exports.getUsers = async (req, res) => {
  const users = await User.find({ isAdmin: false }).select("name email");
  res.json(users);
};

/* ---------------- DASHBOARD STATS ---------------- */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const bookingAgg = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$quantity" }
        }
      }
    ]);

    const totalTickets =
      bookingAgg.length > 0 ? bookingAgg[0].totalTickets : 0;

    const totalUsers = await User.countDocuments({
      isAdmin: false
    });

    res.json({
      totalEvents,
      totalTickets,
      totalUsers
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};

/* ---------------- USER → EVENTS ATTENDED ---------------- */
exports.getBookingsSummary = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "name date location price")
      .populate("user", "_id");

    const summary = {};

    bookings.forEach((b) => {
      if (!b.user || !b.event) return;

      const userId = b.user._id.toString();

      if (!summary[userId]) {
        summary[userId] = [];
      }

      summary[userId].push({
        event: b.event,
        quantity: b.quantity
      });
    });

    res.json(summary);
  } catch (err) {
    console.error("BOOKING SUMMARY ERROR:", err);
    res.status(500).json({ msg: "Failed to load booking summary" });
  }
};

/* ---------------- REVENUE ANALYTICS ---------------- */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenueAgg = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$quantity", "$priceAtBooking"]
            }
          },
          totalTickets: { $sum: "$quantity" }
        }
      }
    ]);

    const revenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const tickets =
      revenueAgg.length > 0 ? revenueAgg[0].totalTickets : 0;

    res.json({
      totalRevenue: revenue,
      totalTickets: tickets
    });
  } catch (err) {
    console.error("REVENUE ERROR:", err);
    res.status(500).json({ msg: "Failed to load revenue analytics" });
  }
};
