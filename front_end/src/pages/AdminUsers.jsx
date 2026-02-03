import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Collapse
} from "@mui/material";
import { motion } from "framer-motion";
import API from "../api";
import bgImage from "../assets/landing.jpg";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableMode, setTableMode] = useState(true);
  const [openUser, setOpenUser] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get("/admin/users"),
      API.get("/admin/bookings-summary")
    ])
      .then(([usersRes, summaryRes]) => {
        setUsers(usersRes.data);
        setSummary(summaryRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  if (loading) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 8
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 5
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={900} color="white">
            User Analytics
          </Typography>
          <Typography color="#9ca3af">
            Attendance and engagement overview
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={tableMode}
              onChange={() => setTableMode(!tableMode)}
              color="success"
            />
          }
          label={<Typography color="white">Table view</Typography>}
        />
      </Box>

      {/* TABLE VIEW */}
      {tableMode && (
        <Paper
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255,255,255,0.96)"
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Events</b></TableCell>
                <TableCell><b>Tickets</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => {
                const bookings = summary[user._id] || [];
                const tickets = bookings.reduce(
                  (sum, b) => sum + b.quantity,
                  0
                );
                const isOpen = openUser === user._id;

                return (
                  <>
                    {/* MAIN ROW */}
                    <TableRow
                      key={user._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        setOpenUser(isOpen ? null : user._id)
                      }
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{bookings.length}</TableCell>
                      <TableCell>{tickets}</TableCell>
                    </TableRow>

                    {/* EXPANDED ROW */}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ p: 0, borderBottom: 0 }}
                      >
                        <Collapse in={isOpen} timeout="auto">
                          <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
                            <Typography fontWeight={700} mb={2}>
                              Booked Events
                            </Typography>

                            {bookings.length === 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No bookings
                              </Typography>
                            )}

                            {bookings.map((b, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr auto",
                                  alignItems: "center",
                                  gap: 2,
                                  maxWidth: 420,   // ✅ FIX: removes empty space
                                  mb: 1
                                }}
                              >
                                <Typography>
                                  {b.event.name}
                                </Typography>

                                <Chip
                                  size="small"
                                  label={`${b.quantity} ticket${b.quantity > 1 ? "s" : ""}`}
                                  sx={{
                                    fontWeight: 700,
                                    bgcolor: "rgba(34,197,94,0.15)",
                                    color: "#16a34a"
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* CARD VIEW — UNCHANGED */}
      {!tableMode && (
        <Grid container spacing={4}>
          {users.map((user) => {
            const bookings = summary[user._id] || [];

            return (
              <Grid item xs={12} md={6} lg={4} key={user._id}>
                <motion.div whileHover={{ y: -6 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.25)"
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#16a34a" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={800}>
                            {user.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {bookings.map((b, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1
                          }}
                        >
                          <Typography>{b.event.name}</Typography>
                          <Chip
                            size="small"
                            label={`x${b.quantity}`}
                            sx={{
                              bgcolor: "rgba(34,197,94,0.15)",
                              color: "#16a34a"
                            }}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
