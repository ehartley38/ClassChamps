import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const StudentClassroomPanel = ({ classroom }) => {
  const [dueAssignments, setDueAssignments] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    // For each assignment in this classroom, check if it is due
    const dueAssignments = classroom.assignmentIds.filter((assignment) => {
      return new Date(assignment.dueDate) > new Date();
    });
    setDueAssignments(dueAssignments);
  }, []);

  const handleDetails = () => {
    navigate(`${classroom.roomName}`, { state: { classroom } });
  };

  return (
    <Grid item xs={4}>
      <Paper
        elevation={3}
        sx={{
          height: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography align="center" sx={{ pt: 2 }} variant="h6">
            {classroom.roomName}
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ pb: 2 }}>
          <Button variant="contained" onClick={() => handleDetails()}>
            Enter
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};
