import { Box, Grid, Typography } from "@mui/material";

export const BadgeCard = ({ awardedBadge, badge, badgeImages }) => {
  const dateString = awardedBadge.awardedDate.slice(0, 10);

  return (
    <Grid item xs={4}>
      <Grid container>
        <Grid item xs={12} justifyContent="center" flexDirection="column">
          <Box
            className="badge-card"
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
            <Box sx={{ mx: 2 }}>{badge.description}</Box>
            <Box
              sx={{
                alignItems: "flex-end",
              }}
            >
              <Typography sx={{ textAlign: "center", mb: 2, mx: 2 }}>
                {dateString}
              </Typography>{" "}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
