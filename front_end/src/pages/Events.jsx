import { useEffect, useMemo, useState } from "react";
import API from "../api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import defaultImage from "../assets/default-event.jpg";

export default function Events() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    API.get("/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const visibleEvents = useMemo(() => {
    let list = [...events];

    if (!isAdmin) {
      list = list.filter(
        (e) => new Date(e.bookingCloseAt).getTime() > now
      );
    }

    if (search) {
      list = list.filter((e) =>
        `${e.name} ${e.location}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "location":
        list.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return list;
  }, [events, search, sortBy, now, isAdmin]);

const getTimeLeft = (closeAt) => {
  const diffMs = new Date(closeAt).getTime() - now;

  if (diffMs <= 0) return "Closed";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  const hours = totalHours;
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};


  if (loading) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, lg: 5 }, py: 4, maxWidth: "100%" }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={900} mb={3}>
        Discover Events
      </Typography>

      {/* FILTER BAR */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          background: "#f8fafc"
        }}
      >
        <TextField
          size="small"
          placeholder="Search by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: 200, sm: 260 } }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="priceLow">Price ↑</MenuItem>
            <MenuItem value="priceHigh">Price ↓</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* GRID — FLUID, NO EMPTY SPACE */}
      <Grid
        container
        spacing={3}
        sx={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          display: "grid"
        }}
      >
        {visibleEvents.map((event) => (
          <motion.div
            key={event._id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 14px 30px rgba(0,0,0,0.12)"
              }}
            >
              <img
                src={event.thumbnail || defaultImage}
                alt={event.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover"
                }}
              />

              <CardContent sx={{ pb: 1 }}>
                <Typography fontWeight={700} mb={0.5}>
                  {event.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {event.date} • {event.time}
                </Typography>

                <Typography variant="body2" mt={1}>
                  📍 {event.location}
                </Typography>

                <Typography variant="body2" mt={0.5}>
                  🎟 {event.availableSeats} seats left
                </Typography>

                <Chip
                  label={`Closes in ${getTimeLeft(
                    event.bookingCloseAt
                  )}`}
                  size="small"
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </CardContent>

              <Box
                sx={{
                  px: 2,
                  pb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography fontWeight={800}>
                  ₹{event.price}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    navigate(`/events/${event._id}`)
                  }
                >
                  View
                </Button>
              </Box>
            </Card>
          </motion.div>
        ))}
      </Grid>

      {visibleEvents.length === 0 && (
        <Typography
          sx={{ mt: 8, textAlign: "center", color: "text.secondary" }}
        >
          No events found
        </Typography>
      )}
    </Box>
  );
}
