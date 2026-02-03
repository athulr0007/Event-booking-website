import { useEffect, useState } from "react";
import API from "../api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";

export default function AdminAddEvent() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    availableSeats: "",
    category: ""
  });

  const loadEvents = () => {
    API.get("/events").then(res => setEvents(res.data));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async () => {
    await API.post("/events", form);
    alert("Event added");
    loadEvents();
  };

  const deleteEvent = async (id) => {
    await API.delete(`/events/${id}`);
    loadEvents();
  };

  return (
    <Box sx={{ display:"flex", justifyContent:"center", mt:4 }}>
      <Paper sx={{ p: 4, width: { xs: '95%', md: 500 }, maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>Admin – Add Event</Typography>

        {Object.keys(form).map(key => (
          <TextField
            key={key}
            label={key}
            fullWidth
            sx={{ mb:2 }}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <Button variant="contained" fullWidth onClick={addEvent}>
          Add Event
        </Button>

        <Typography variant="h6" mt={4}>Existing Events</Typography>

        {events.map(e => (
          <Box key={e._id} sx={{ mt:2 }}>
            <Typography>{e.name}</Typography>
            <Button color="error" onClick={() => deleteEvent(e._id)}>
              Delete
            </Button>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
