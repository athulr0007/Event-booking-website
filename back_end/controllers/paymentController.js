const Stripe = require("stripe");
const Event = require("../models/Event");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


exports.createCheckoutSession = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (new Date(event.bookingCloseAt) <= new Date()) {
      return res.status(400).json({ msg: "Booking closed" });
    }

    if (event.availableSeats < quantity) {
      return res
        .status(400)
        .json({ msg: "Not enough seats available" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: event.name,
              description: event.location
            },
            unit_amount: event.price * 100
          },
          quantity
        }
      ],
      success_url: `${process.env.CLIENT_URL}/bookings?success=true`,
cancel_url: `${process.env.CLIENT_URL}/events/${eventId}`,

      metadata: {
        eventId,
        quantity
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ msg: "Stripe session failed" });
  }
};
