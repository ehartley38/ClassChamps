import { Box, CircularProgress, Grid } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress size={80} thickness={3} />
    </Box>
  );
};
