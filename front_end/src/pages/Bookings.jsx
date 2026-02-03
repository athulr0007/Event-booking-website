import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Drawer,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { motion } from "framer-motion";
import API from "../api";
import defaultImage from "../assets/default-event.jpg";

export default function Bookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelQty, setCancelQty] = useState(1);

  /* ---------- CONFIRM BOOKING AFTER PAYMENT ---------- */
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const success = params.get("success");

  if (!success) {
    loadBookings();
    return;
  }

  const pending = JSON.parse(
    localStorage.getItem("pendingBooking")
  );

  // 🔒 HARD GUARD — prevent duplicate booking
  if (!pending || pending.confirmed) {
    loadBookings();
    return;
  }

  // mark as confirmed BEFORE API call
  pending.confirmed = true;
  localStorage.setItem(
    "pendingBooking",
    JSON.stringify(pending)
  );

  API.post(`/bookings/${pending.eventId}`, {
    quantity: pending.quantity
  })
    .then(() => {
      localStorage.removeItem("pendingBooking");

      // 🔑 REMOVE success=true FROM URL
      window.history.replaceState(
        {},
        document.title,
        "/bookings"
      );

      loadBookings();
    })
    .catch(() => {
      localStorage.removeItem("pendingBooking");
      alert("Booking confirmation failed");
      loadBookings();
    });
}, [location.search]);


  const loadBookings = () => {
    API.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => {});
  };

  const today = new Date().setHours(0, 0, 0, 0);

  const { upcoming, history } = useMemo(() => {
    const upcoming = [];
    const history = [];

    bookings.forEach((b) => {
      if (!b.event) return;
      const eventDate = new Date(b.event.date).getTime();
      if (eventDate >= today) upcoming.push(b);
      else history.push(b);
    });

    return { upcoming, history };
  }, [bookings, today]);

  const confirmCancel = async () => {
    try {
      await API.delete(`/bookings/${cancelTarget._id}`, {
        data: { quantity: cancelQty }
      });
      setCancelTarget(null);
      setCancelQty(1);
      loadBookings();
    } catch {
      alert("Cancel failed");
    }
  };

  const renderCards = (list, isHistory = false) => (
    <Grid container spacing={4}>
      {list.map((b) => (
        <Grid item xs={12} md={6} lg={4} key={b._id}>
          <motion.div whileHover={{ y: -4 }}>
            <Card sx={{ borderRadius: 3 }}>
              <img
                src={b.event.thumbnail || defaultImage}
                alt={b.event.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover"
                }}
              />

              <CardContent>
                <Typography fontWeight={800}>
                  {b.event.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {b.event.date} • {b.event.time}
                </Typography>

                <Typography mt={1}>
                  🎟 Tickets: {b.quantity}
                </Typography>

                <Chip
                  label={isHistory ? "Completed" : "Upcoming"}
                  size="small"
                  color={isHistory ? "default" : "success"}
                  sx={{ mt: 1 }}
                />

                {!isHistory && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setCancelTarget(b);
                        setCancelQty(1);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4
        }}
      >
        <Typography variant="h4" fontWeight={900}>
          My Bookings
        </Typography>

        <IconButton onClick={() => setOpenHistory(true)}>
          <i className="bi bi-clock-history" />
        </IconButton>
      </Box>

      {renderCards(upcoming, false)}

      <Drawer
        anchor="right"
        open={openHistory}
        onClose={() => setOpenHistory(false)}
      >
        <Box sx={{ width: { xs: '80vw', sm: 420 }, p: 3 }}>
          <Typography variant="h5" fontWeight={800} mb={3}>
            Booking History
          </Typography>
          {renderCards(history, true)}
        </Box>
      </Drawer>

      {/* CANCEL DIALOG */}
      <Dialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
      >
        <DialogTitle>Cancel Tickets</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            You booked {cancelTarget?.quantity} ticket(s).
            How many do you want to cancel?
          </Typography>

          <TextField
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              max: cancelTarget?.quantity || 1
            }}
            value={cancelQty}
            onChange={(e) =>
              setCancelQty(Number(e.target.value))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>
            Back
          </Button>
          <Button color="error" onClick={confirmCancel}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
