const mongoose = require("mongoose");
const Event = require("./models/Event");
const User = require("./models/User");

// 🔴 PUT YOUR ACTUAL MONGO URI HERE
const MONGO_URI =
    "mongodb+srv://athulr1230:athulr0007@cluster0.8bawxbu.mongodb.net/event_booking?retryWrites=true&w=majority&appName=Cluster0"

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // 🔴 CHANGE TO YOUR ADMIN EMAIL
    const admin = await User.findOne({ email: "test1@gmail.com" });
    if (!admin) throw new Error("Admin user not found");

    await Event.deleteMany();
    console.log("Old events removed");

    const events = [
      {
        name: "Tech Conference 2026",
        date: "2026-01-20",
        time: "10:00",
        bookingCloseAt: "2026-01-19T23:59",
        location: "Bangalore",
        category: "Technology",
        description: "Annual technology conference",
        availableSeats: 150,
        price: 799,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Music Night Live",
        date: "2026-02-05",
        time: "18:30",
        bookingCloseAt: "2026-02-04T22:00",
        location: "Kochi",
        category: "Music",
        description: "Live concert event",
        availableSeats: 300,
        price: 499,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Startup Meetup",
        date: "2026-01-10",
        time: "14:00",
        bookingCloseAt: "2026-01-09T20:00",
        location: "Trivandrum",
        category: "Business",
        description: "Meet founders and investors",
        availableSeats: 80,
        price: 199,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "AI & ML Workshop",
        date: "2026-03-15",
        time: "09:30",
        bookingCloseAt: "2026-03-14T21:00",
        location: "Chennai",
        category: "Technology",
        description: "Hands-on AI workshop",
        availableSeats: 60,
        price: 999,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Design Thinking Bootcamp",
        date: "2026-02-18",
        time: "11:00",
        bookingCloseAt: "2026-02-17T18:00",
        location: "Hyderabad",
        category: "Design",
        description: "Design thinking fundamentals",
        availableSeats: 100,
        price: 599,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Blockchain Summit",
        date: "2026-04-10",
        time: "10:00",
        bookingCloseAt: "2026-04-09T23:00",
        location: "Bangalore",
        category: "Technology",
        description: "Blockchain and Web3 conference",
        availableSeats: 200,
        price: 899,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Marketing Growth Meetup",
        date: "2026-01-28",
        time: "16:00",
        bookingCloseAt: "2026-01-27T20:00",
        location: "Mumbai",
        category: "Business",
        description: "Growth strategies for startups",
        availableSeats: 120,
        price: 299,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Photography Masterclass",
        date: "2026-02-22",
        time: "09:00",
        bookingCloseAt: "2026-02-21T19:00",
        location: "Kochi",
        category: "Workshop",
        description: "Professional photography training",
        availableSeats: 40,
        price: 749,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "Cyber Security Talk",
        date: "2026-03-02",
        time: "15:00",
        bookingCloseAt: "2026-03-01T21:00",
        location: "Delhi",
        category: "Technology",
        description: "Cyber security trends",
        availableSeats: 180,
        price: 399,
        thumbnail: "",
        createdBy: admin._id
      },
      {
        name: "UX/UI Design Meetup",
        date: "2026-01-16",
        time: "17:00",
        bookingCloseAt: "2026-01-15T20:00",
        location: "Pune",
        category: "Design",
        description: "UI/UX designer networking",
        availableSeats: 90,
        price: 249,
        thumbnail: "",
        createdBy: admin._id
      }
    ];

    await Event.insertMany(events);
    console.log(`✅ ${events.length} ACTIVE events seeded`);
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedEvents();
