import { Box, Typography } from "@mui/material";

export default function EventTicker({ events }) {
  if (!events.length) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 44,
        background: "#020617",
        overflow: "hidden",
        zIndex: 1200
      }}
    >
      {/* EDGE FADES */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 80,
          height: "100%",
          background:
            "linear-gradient(to right, #020617 60%, transparent)",
          zIndex: 2
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 80,
          height: "100%",
          background:
            "linear-gradient(to left, #020617 60%, transparent)",
          zIndex: 2
        }}
      />

      {/* SCROLL STRIP */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          whiteSpace: "nowrap",
          animation: "ticker 45s linear infinite",
          "@keyframes ticker": {
            "0%": { transform: "translateX(0)" },
            "100%": {
              transform: "translateX(-50%)"
            }
          }
        }}
      >
        {[...events, ...events].map((e, i) => (
          <Typography
            key={i}
            sx={{
              mx: 5,
              color: "#e5e7eb",
              fontWeight: 600,
              fontSize: "0.9rem",
              flexShrink: 0
            }}
          >
            ● {e.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
