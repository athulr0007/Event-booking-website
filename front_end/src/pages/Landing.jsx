import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/landing.jpg";


import API from "../api";
import EventTicker from "./EventTicker";


export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/events", { replace: true });
    }
  }, [navigate]);



  const [events, setEvents] = useState([]);

useEffect(() => {
  API.get("/events")
    .then((res) => setEvents(res.data))
    .catch(() => {});
}, []);




  return (
    <Box sx={{ width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAVBAR */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
          zIndex: 10
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.05em",
              cursor: "pointer",
              color: "white",
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
            onClick={() => navigate("/")}
          >
            EVENT BOOKINGS
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            sx={{ color: "white", fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>

          <Button
            variant="contained"
            sx={{
              ml: 2,
              background: "#22c55e",
              fontWeight: 700,
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              "&:hover": { background: "#16a34a" }
            }}
            onClick={() => navigate("/login")}
          >
            Book Ticket
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: `
            linear-gradient(
              rgba(2, 6, 23, 0.75),
              rgba(2, 6, 23, 0.75)
            ),
            url(${bgImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        {/* TEXT BOX */}
        <Box
          sx={{
            maxWidth: 760,
            px: 3,
            py: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.45)"
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              color: "#ffffff",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Event ticketing made simple
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#e5e7eb",
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Discover events and book tickets in seconds
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.6,
              fontSize: "1rem",
              background: "#22c55e",
              fontWeight: 700,
              "&:hover": { background: "#16a34a" }
            }}
            onClick={() => navigate("/login")}
          >
            Book Ticket
          </Button>
        </Box>
      </Box>
      <EventTicker events={events} />
    </Box>
  );
}
