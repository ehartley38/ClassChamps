import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ClassroomPanel = ({ classroom, deleteClassroom }) => {
  let navigate = useNavigate();

  const handleDetails = () => {
    navigate(`${classroom.roomName}`, { state: { classroom } });
  };

  return (
    <Grid item xs={12} sx={{ width: "100%", py: 1 }}>
      <Paper
        elevation={3}
        sx={{
          height: 130,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography align="center" sx={{ py: 2 }} variant="h6">
            {classroom.roomName}
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ pb: 2 }}>
          <Button
            variant="contained"
            sx={{ mx: 2 }}
            onClick={() => handleDetails()}
          >
            Enter
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteClassroom(classroom)}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};
