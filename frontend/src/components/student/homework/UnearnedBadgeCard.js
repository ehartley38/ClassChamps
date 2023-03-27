import { Box } from "@mui/material";

export const UnearnedBadgeCard = ({ badge }) => {
  return (
    <Box className="un-earned-badge-card" sx={{ flexWrap: "wrap" }}>
      Badge: {badge.name}
      {badge.description}
    </Box>
  );
};
