import { Box, Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box align="center">
      <Typography>Unauthorized</Typography>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </Box>
  );
};
