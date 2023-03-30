import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import assignmentService from "../../../services/assignments";

export const StudentClassroomPanel = ({ classroom }) => {
  const [dueAssignments, setDueAssignments] = useState();
  let navigate = useNavigate();
  const { jwt } = useAuth();

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
    <>
      <Box sx={{ width: "31%" }}>
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
            <Typography align="center"></Typography>
          </Box>
          <Box textAlign="center" sx={{ pb: 2 }}>
            <Button variant="contained" onClick={() => handleDetails()}>
              Enter
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
