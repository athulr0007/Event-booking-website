import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import {
  Event,
  ConfirmationNumber,
  People
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api";
import bgImage from "../assets/landing.jpg";
import { CurrencyRupee } from "@mui/icons-material";


export default function AdminDashboard() {
  const navigate = useNavigate();

 const [stats, setStats] = useState({
  events: 0,
  tickets: 0,
  users: 0,
  revenue: 0
});

useEffect(() => {
  Promise.all([
    API.get("/admin/dashboard-stats"),
    API.get("/admin/revenue")
  ])
    .then(([statsRes, revenueRes]) => {
      setStats({
        events: statsRes.data.totalEvents,
        users: statsRes.data.totalUsers,
        tickets: revenueRes.data.totalTickets,
        revenue: revenueRes.data.totalRevenue
      });
    })
      .catch((err) => {
        console.error("Dashboard stats error:", err);
      });
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
      transition={{ duration: 0.45, ease: "easeOut" }}
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 8
      }}
    >
      {/* HEADER */}
      <Typography variant="h3" fontWeight={900} color="white" mb={1}>
        Admin Dashboard
      </Typography>

      <Typography color="#9ca3af" mb={6}>
        Platform overview and quick actions
      </Typography>

      {/* STATS */}
      <Grid container spacing={4} mb={6}>
        <StatCard
          icon={<Event />}
          label="Total Events"
          value={stats.events}
        />
        <StatCard
          icon={<ConfirmationNumber />}
          label="Tickets Sold"
          value={stats.tickets}
        />
        <StatCard
          icon={<People />}
          label="Users"
          value={stats.users}
        />
<StatCard
  icon={<CurrencyRupee />}
  label="Total Revenue"
  value={`₹${stats.revenue.toLocaleString()}`}
/>

      </Grid>

      {/* ACTION CARDS */}
      <Grid container spacing={4}>
        <ActionCard
          title="Manage Events"
          desc="View, update, and control all events"
          onClick={() => navigate("/events")}
        />

        <ActionCard
          title="Create Event"
          desc="Add a new event to the platform"
          primary
          onClick={() => navigate("/create-event")}
        />

        <ActionCard
          title="User Analytics"
          desc="Track attendance and engagement"
          onClick={() => navigate("/admin/users")}
        />
      </Grid>
    </Box>
  );
}

/* ---------- STAT CARD ---------- */

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

/* ---------- ACTION CARD ---------- */

function ActionCard({ title, desc, onClick, primary }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        component={motion.div}
        whileHover={{ y: -6 }}
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
        onClick={onClick}
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
