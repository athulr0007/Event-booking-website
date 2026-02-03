import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

const CATEGORY_OPTIONS = [
  "Technology",
  "Music",
  "Business",
  "Design",
  "Workshop",
  "Conference",
  "Meetup",
  "Sports",
  "Education",
  "Other"
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const eventId = params.get("id");
  const isEdit = Boolean(eventId);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  /* ---------- ADMIN GUARD ---------- */
  useEffect(() => {
    if (!isAdmin) navigate("/events", { replace: true });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const today = new Date().toISOString().split("T")[0];
  const nowDateTime = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    name: "",
    date: "",
    bookingCloseAt: "",
    location: "",
    category: "",
    description: "",
    availableSeats: "",
    price: "",
    thumbnail: ""
  });

  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const [customCategory, setCustomCategory] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD EVENT FOR EDIT ---------- */
  useEffect(() => {
    if (!isEdit) return;

    API.get(`/events/${eventId}`).then((res) => {
      const e = res.data;

      const [h, m] = e.time.split(":");
      let h12 = Number(h);
      let p = "AM";

      if (h12 >= 12) {
        p = "PM";
        if (h12 > 12) h12 -= 12;
      }
      if (h12 === 0) h12 = 12;

      setHour(String(h12));
      setMinute(m);
      setPeriod(p);

      const isCustom =
        e.category && !CATEGORY_OPTIONS.includes(e.category);

      setForm({
        name: e.name,
        date: e.date,
        bookingCloseAt: e.bookingCloseAt.slice(0, 16),
        location: e.location,
        category: isCustom ? "Other" : e.category,
        description: e.description,
        availableSeats: e.availableSeats,
        price: e.price,
        thumbnail: e.thumbnail || ""
      });

      if (isCustom) setCustomCategory(e.category);
      if (e.thumbnail) setPreview(e.thumbnail);
    });
  }, [isEdit, eventId]);

  /* ---------- HELPERS ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm({ ...form, thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const to24Hour = () => {
    let h = Number(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  /* ---------- SUBMIT ---------- */
  const submitEvent = async () => {
    if (!form.name || !form.date || !form.bookingCloseAt || !form.location) {
      alert("Fill all required fields");
      return;
    }

    if (form.category === "Other" && !customCategory.trim()) {
      alert("Specify category");
      return;
    }

    const time24 = to24Hour();
    const eventDateTime = new Date(`${form.date}T${time24}`);
    const bookingClose = new Date(form.bookingCloseAt);

    if (bookingClose <= new Date()) {
      alert("Booking close must be in the future");
      return;
    }

    if (bookingClose >= eventDateTime) {
      alert("Booking close must be before event time");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        time: time24,
        category:
          form.category === "Other" ? customCategory : form.category,
        availableSeats: Number(form.availableSeats),
        price: Number(form.price)
      };

      isEdit
        ? await API.put(`/events/${eventId}`, payload)
        : await API.post("/events", payload);

      navigate("/events");
    } catch {
      alert("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, width: { xs: '95%', md: 580 }, maxWidth: 600 }}>
        <Typography variant="h5" fontWeight={800} mb={2}>
          {isEdit ? "Update Event" : "Create Event"}
        </Typography>

        <TextField label="Event Name" name="name" fullWidth sx={{ mb: 2 }}
          value={form.name} onChange={handleChange} />

        <TextField type="date" label="Event Date" name="date" fullWidth
          InputLabelProps={{ shrink: true }} inputProps={{ min: today }}
          sx={{ mb: 2 }} value={form.date} onChange={handleChange} />

        {/* 12-HOUR TIME INPUT */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField label="Hour" type="number" inputProps={{ min: 1, max: 12 }}
              value={hour} onChange={(e) => setHour(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Minute" type="number" inputProps={{ min: 0, max: 59 }}
              value={minute} onChange={(e) => setMinute(e.target.value.padStart(2, "0"))} />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>AM / PM</InputLabel>
              <Select value={period} label="AM / PM"
                onChange={(e) => setPeriod(e.target.value)}>
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField type="datetime-local" label="Booking Closes At"
          name="bookingCloseAt" fullWidth InputLabelProps={{ shrink: true }}
          inputProps={{ min: nowDateTime }} sx={{ mb: 2 }}
          value={form.bookingCloseAt} onChange={handleChange} />

        <TextField label="Location" name="location" fullWidth sx={{ mb: 2 }}
          value={form.location} onChange={handleChange} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select label="Category" name="category"
            value={form.category} onChange={handleChange}>
            {CATEGORY_OPTIONS.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {form.category === "Other" && (
          <TextField label="Custom Category" fullWidth sx={{ mb: 2 }}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)} />
        )}

        <TextField label="Description" name="description" multiline rows={3}
          fullWidth sx={{ mb: 2 }} value={form.description}
          onChange={handleChange} />

        <TextField
  label="Available Seats"
  name="availableSeats"
  type="number"
  fullWidth
  sx={{ mb: 2 }}
  value={form.availableSeats}
  onChange={handleChange}
/>

<TextField
  label="Price (₹)"
  name="price"
  type="number"
  fullWidth
  sx={{ mb: 2 }}
  value={form.price}
  onChange={handleChange}
/>


        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {preview && (
          <img src={preview} alt="Preview"
            style={{ width: "100%", height: 180, objectFit: "cover", marginTop: 12 }} />
        )}

        <Button variant="contained" fullWidth sx={{ mt: 3 }}
          disabled={loading} onClick={submitEvent}>
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </Button>
      </Paper>
    </Box>
  );
}
