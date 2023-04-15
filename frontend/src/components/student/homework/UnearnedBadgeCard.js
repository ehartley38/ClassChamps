import { Box, Typography, Grid } from "@mui/material";

export const UnearnedBadgeCard = ({ badge }) => {
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
              filter: "grayscale(100%)",
              mb: 2,
            }}
          >
            <Box className="badge-icon" sx={{ mt: 2 }}>
              <img
                src={`${process.env.PUBLIC_URL + badge.url}`}
                alt="badge icon"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  alignItems: "flex-start",
                  mx: 2,
                }}
              >
                <Typography variant="h3">{badge.name}</Typography>
              </Box>
              <Box sx={{ mx: 2 }}>{badge.description}</Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
