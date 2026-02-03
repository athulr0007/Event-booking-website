import { useEffect, useState } from "react";
import API from "../api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      const res = await API.get("/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("You are not authorized or no bookings found");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const approve = async (id) => {
    await API.put(`/admin/approve/${id}`);
    loadBookings();
  };

  const reject = async (id) => {
    await API.put(`/admin/reject/${id}`);
    loadBookings();
  };

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  if (bookings.length === 0) {
    return (
      <Typography sx={{ mt: 3 }}>
        No bookings available
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {bookings.map((b) => (
        <Card key={b._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>User: {b.user?.name}</Typography>
            <Typography>Event: {b.event?.name}</Typography>
            <Typography>Seats: {b.seats}</Typography>
            <Typography>Status: {b.paymentStatus}</Typography>

            {b.paymentStatus === "pending" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                  onClick={() => approve(b._id)}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => reject(b._id)}
                >
                  Reject
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
