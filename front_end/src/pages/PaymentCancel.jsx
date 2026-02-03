import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Payment Cancelled
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Your payment was not processed.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/events")}
          sx={{
            background: "#22c55e",
            "&:hover": { background: "#16a34a" }
          }}
        >
          Back to Events
        </Button>
      </Box>
    </Box>
  );
}
