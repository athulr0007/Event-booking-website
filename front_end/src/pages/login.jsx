import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- STEP 1: PASSWORD LOGIN ---------------- */
  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (res.data.step === "OTP_REQUIRED") {
        setStep("OTP");
        return;
      }

      setError("Unexpected login response");
    } catch (err) {
      setError(
        err.response?.data?.msg || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2: OTP VERIFY ---------------- */
  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login/otp", {
        email,
        otp
      });

      // CLEAR OLD SESSION
      localStorage.clear();

      // STORE SESSION
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "isAdmin",
        res.data.user.isAdmin ? "true" : "false"
      );

      setIsLoggedIn(true);

      // REDIRECT
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Paper sx={{ p: 4, width: { xs: '90%', sm: 360 }, maxWidth: 400 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          {step === "LOGIN" ? "Login" : "Enter OTP"}
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={1}>
            {error}
          </Typography>
        )}

        {/* -------- LOGIN FORM -------- */}
        {step === "LOGIN" && (
          <>
            <TextField
              label="Email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={login}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
          </>
        )}

        {/* -------- OTP FORM -------- */}
        {step === "OTP" && (
          <>
            <Typography
              textAlign="center"
              mb={2}
              color="text.secondary"
            >
              OTP sent to your email
            </Typography>

            <TextField
              label="6-digit OTP"
              fullWidth
              sx={{ mb: 2 }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Checking..." : "Verify OTP"}
            </Button>
          </>
        )}

        <Typography textAlign="center" mt={2}>
          Don’t have an account?
          <Button
            variant="text"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
