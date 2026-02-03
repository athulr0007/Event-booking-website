import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = localStorage.getItem("isAdmin") === "true";

 const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};


  const NavBtn = ({ label, path }) => (
    <Button
      onClick={() => navigate(path)}
      sx={{
        color: "white",
        fontWeight: 600,
        fontSize: { xs: '0.7rem', md: '0.875rem' },
        borderBottom:
          location.pathname === path
            ? "2px solid #22c55e"
            : "2px solid transparent",
        borderRadius: 0,
        px: { xs: 0.5, md: 2 },
        minWidth: 'auto'
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#020617",
        boxShadow: "none"
      }}
    >
      <Toolbar sx={{ gap: { xs: 0.25, md: 2 }, minHeight: { xs: 48, md: 64 }, px: { xs: 1, md: 2 } }}>
        {/* BRAND */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: "0.05em",
            cursor: "pointer",
            fontSize: { xs: '0.9rem', md: '1.25rem' }
          }}
          onClick={() =>
            navigate(isAdmin ? "/admin/dashboard" : "/dashboard")
          }
        >
          EVENT CROWD
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* USER NAV */}
        {!isAdmin && (
          <>
            <NavBtn label="Dashboard" path="/dashboard" />
            <NavBtn label="Events" path="/events" />
            <NavBtn label="My Bookings" path="/bookings" />
            <NavBtn label="Profile" path="/profile" />
          </>
        )}

        {/* ADMIN NAV */}
        {isAdmin && (
          <>
            <NavBtn label="Dashboard" path="/admin/dashboard" />
            <NavBtn label="Events" path="/events" />
            <NavBtn label="Create Event" path="/create-event" />
            <NavBtn label="Users" path="/admin/users" />
          </>
        )}

        <Button
          onClick={logout}
          sx={{
            ml: { xs: 1, md: 2 },
            background: "#22c55e",
            color: "black",
            fontWeight: 700,
            fontSize: { xs: '0.7rem', md: '0.875rem' },
            px: { xs: 1, md: 2 },
            "&:hover": { background: "#16a34a" }
          }}
          variant="contained"
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
