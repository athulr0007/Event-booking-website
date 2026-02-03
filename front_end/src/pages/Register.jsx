import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = async () => {
  const nameRegex = /^[A-Za-z ]+$/;

  if (!nameRegex.test(name)) {
    setError(
      "Name should contain only letters (no numbers or special characters)"
    );
    return;
  }

  try {
    await API.post("/auth/register", {
      name,
      email,
      password
    });

    navigate("/login");
  } catch (err) {
    setError(
      err.response?.data?.msg || "Registration failed"
    );
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ padding: 4, width: { xs: '90%', sm: 350 }, maxWidth: 400 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Register
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={1}>
            {error}
          </Typography>
        )}

        <TextField
          label="Name"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" fullWidth onClick={register}>
          Register
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <Button variant="text" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
