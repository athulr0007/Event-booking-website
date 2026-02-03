import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import API from "../api";

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/revenue").then((res) => setStats(res.data));
  }, []);

  if (!stats) return null;

  const Tile = ({ label, value }) => (
    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={900} mb={4}>
        Revenue Analytics
      </Typography>

      <Grid container spacing={4}>
        <Tile label="Total Revenue" value={`₹${stats.revenue}`} />
        <Tile label="Tickets Sold" value={stats.tickets} />
        <Tile label="Events" value={stats.events} />
        <Tile label="Users" value={stats.users} />
      </Grid>
    </Box>
  );
}
