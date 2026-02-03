import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from "@mui/material";
import defaultImage from "../assets/default-event.jpg";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------- FETCH EVENT ---------- */
  useEffect(() => {
    API.get(`/events/${id}`).then((res) => setEvent(res.data));

    if (isAdmin) {
      API.get(`/bookings/event/${id}`).then((res) =>
        setBookings(res.data)
      );
    }
  }, [id, isAdmin]);

  /* ---------- COUNTDOWN ---------- */
  useEffect(() => {
    if (!event?.bookingCloseAt) return;

    const interval = setInterval(() => {
      const diff =
        new Date(event.bookingCloseAt).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Booking Closed");
        clearInterval(interval);
        return;
      }

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);

      if (days >= 1) {
        setTimeLeft(`${days} day${days > 1 ? "s" : ""}`);
      } else {
        const hours = totalHours;
        const minutes = totalMinutes % 60;
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const bookingClosed =
    event && new Date(event.bookingCloseAt) <= new Date();

  /* ---------- STRIPE PAYMENT ---------- */
  const handlePayment = async () => {
    setErrorMsg("");

    if (!quantity || quantity < 1) {
      setErrorMsg("Select at least one ticket");
      return;
    }

    if (quantity > event.availableSeats) {
      setErrorMsg("Not enough seats available");
      return;
    }

    try {
      setLoading(true);

      // 🔑 SAVE BOOKING INTENT BEFORE REDIRECT
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          eventId: event._id,
          quantity
        })
      );

      const res = await API.post("/payment/checkout", {
        eventId: event._id,
        quantity
      });

      window.location.href = res.data.url;
    } catch {
      setErrorMsg("Payment initiation failed");
      setLoading(false);
    }
  };

  /* ---------- DELETE EVENT ---------- */
  const deleteEvent = async () => {
    await API.delete(`/events/${id}`);
    navigate("/events");
  };

  if (!event) return null;

  return (
    <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        {/* IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={event.thumbnail || defaultImage}
            alt={event.name}
            sx={{
              width: "100%",
              height: { xs: 200, md: 320 },
              objectFit: "cover",
              borderRadius: 3
            }}
          />
        </Grid>

        {/* DETAILS */}
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h4" fontWeight={800}>
            {event.name}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {event.date} • {event.time}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            📍 {event.location}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            {event.description}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            🎟 Seats left: {event.availableSeats}
          </Typography>

          <Typography sx={{ mt: 2 }} fontWeight={700}>
            ₹{event.price} per ticket
          </Typography>

          {event.bookingCloseAt && (
            <Paper sx={{ mt: 3, p: 2 }}>
              <Typography fontWeight={700}>
                Booking closes in
              </Typography>
              <Typography
                color={bookingClosed ? "error" : "primary"}
              >
                {timeLeft}
              </Typography>
            </Paper>
          )}

          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {!isAdmin && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <TextField
                type="number"
                label="Number of tickets"
                value={quantity}
                inputProps={{
                  min: 1,
                  max: event.availableSeats
                }}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                sx={{ width: { xs: '100%', sm: 220 }, mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                disabled={
                  loading ||
                  bookingClosed ||
                  event.availableSeats === 0 ||
                  quantity < 1 ||
                  quantity > event.availableSeats
                }
                onClick={handlePayment}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  `Pay & Book ${quantity} Ticket${
                    quantity > 1 ? "s" : ""
                  }`
                )}
              </Button>
            </Box>
          )}

          {isAdmin && (
            <Box sx={{ mt: 3, display: "flex", gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/create-event?id=${id}`)
                }
              >
                Update
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={() => setOpenDelete(true)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* ADMIN BOOKINGS */}
      {isAdmin && (
        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Bookings ({bookings.length})
          </Typography>

          {bookings.map((b, i) => (
            <Typography key={i}>
              {b.user.name} ({b.user.email}) — {b.quantity} ticket
              {b.quantity > 1 ? "s" : ""}
            </Typography>
          ))}
        </Paper>
      )}

      {/* DELETE CONFIRM */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={deleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
