import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import API from "../api";
import bgImage from "../assets/landing.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------- LOAD PROFILE ---------- */
useEffect(() => {
  API.get("/user/me")   // ✅ NO /api here
    .then((res) => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);


  useEffect(() => {
    document.body.style.background = `
      linear-gradient(
        rgba(2,6,23,0.9),
        rgba(2,6,23,0.9)
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
     await API.put("/user/me", user);
   // ✅ CORRECT ENDPOINT
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- HARD GUARDS ---------- */
  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">
          Failed to load profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 8
      }}
    >
      <Typography variant="h3" fontWeight={900} color="white" mb={1}>
        Profile
      </Typography>

      <Typography color="#9ca3af" mb={6}>
        Manage your personal information
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 24px 50px rgba(0,0,0,0.35)"
            }}
          >
            {/* AVATAR */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4
              }}
            >
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: "#16a34a",
                  fontSize: 34,
                  fontWeight: 800
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Typography fontWeight={800} mt={2}>
                {user.name}
              </Typography>

              <Typography color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            {/* FORM */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={user.name || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={user.phone || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  value={user.location || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  disabled
                  value={user.email || ""}
                />
              </Grid>
            </Grid>

            {/* ACTION */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 4
              }}
            >
              <Button
                variant="contained"
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1.3,
                  fontWeight: 700,
                  background: "#22c55e",
                  "&:hover": { background: "#16a34a" }
                }}
                onClick={saveProfile}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
