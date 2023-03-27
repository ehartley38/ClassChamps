import { Box } from "@mui/material";

export const BadgeCard = ({ awardedBadge, badge }) => {
  return (
    <Box className="badge-card" sx={{ flexWrap: "wrap" }}>
      Badge: {badge.name}
      Awarded: {awardedBadge.awardedDate}
      {badge.description}
    </Box>
  );
};
