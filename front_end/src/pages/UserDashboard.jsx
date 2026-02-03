import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import {
  EventAvailable,
  ConfirmationNumber,
  History
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api";
import bgImage from "../assets/landing.jpg";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    upcoming: 0,
    tickets: 0,
    past: 0
  });

  useEffect(() => {
    API.get("/bookings/my")
      .then((res) => {
        const today = new Date().setHours(0, 0, 0, 0);

        let upcoming = 0;
        let past = 0;
        let tickets = 0;

        res.data.forEach((b) => {
          if (!b.event) return;

          tickets += b.quantity;

          const eventDate = new Date(b.event.date).getTime();
          if (eventDate >= today) upcoming++;
          else past++;
        });

        setStats({ upcoming, tickets, past });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.background = `
      linear-gradient(
        rgba(2,6,23,0.88),
        rgba(2,6,23,0.88)
      ),
      url(${bgImage})
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundRepeat = "";
    };
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 8
      }}
    >
      {/* HEADER */}
      <Typography variant="h3" fontWeight={900} color="white" mb={1}>
        Dashboard
      </Typography>

      <Typography color="#9ca3af" mb={6}>
        Your activity overview and quick actions
      </Typography>

      {/* STATS */}
      <Grid container spacing={4} mb={6}>
        <StatCard
          icon={<EventAvailable />}
          label="Upcoming Events"
          value={stats.upcoming}
        />
        <StatCard
          icon={<ConfirmationNumber />}
          label="Tickets Booked"
          value={stats.tickets}
        />
        <StatCard
          icon={<History />}
          label="Past Events"
          value={stats.past}
        />
      </Grid>

      {/* ACTIONS */}
      <Grid container spacing={4}>
        <ActionCard
          title="Browse Events"
          desc="Discover and book new events"
          onClick={() => navigate("/events")}
          primary
        />

        <ActionCard
          title="My Bookings"
          desc="View upcoming and past bookings"
          onClick={() => navigate("/bookings")}
        />

        <ActionCard
          title="Profile"
          desc="Manage your account details"
          onClick={() => navigate("/profile")}
        />
      </Grid>
    </Box>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ icon, label, value }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        component={motion.div}
        whileHover={{ scale: 1.03 }}
        sx={{
          borderRadius: 4,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          "&:hover": {
            boxShadow: "0 22px 50px rgba(34,197,94,0.35)"
          }
        }}
      >
        <CardContent
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            gap: 3
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16a34a"
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={900}>
              {value}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

function ActionCard({ title, desc, onClick, primary }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        component={motion.div}
        whileHover={{ y: -6 }}
        onClick={onClick}
        sx={{
          height: "100%",
          borderRadius: 4,
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 26px 60px rgba(34,197,94,0.35)"
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800} mb={1}>
            {title}
          </Typography>

          <Typography color="text.secondary" mb={4}>
            {desc}
          </Typography>

          <Box
            sx={{
              fontWeight: 700,
              color: primary ? "#16a34a" : "#020617"
            }}
          >
            Open →
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
