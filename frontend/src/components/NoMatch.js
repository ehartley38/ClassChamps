import { Box, Link, Typography } from "@mui/material";

export const NoMatch = () => {
  return (
    <Box align="center">
      <Typography>Page not found</Typography>
      <Link href="/">Return Home</Link>
    </Box>
  );
};
