import { Box, Typography } from "@mui/material";

export const UnearnedBadgeCard = ({ badge }) => {
  return (
    <Box
      className="un-earned-badge-card"
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box className="badge-icon" sx={{ mt: 2 }}></Box>
      <Box
        sx={{
          alignItems: "flex-start",
          mx: 2,
        }}
      >
        <Typography variant="h3">{badge.name}</Typography>
      </Box>
      <Box sx={{ mx: 2, mb: 5 }}>{badge.description}</Box>
    </Box>
  );
};
