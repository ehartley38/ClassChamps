import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../providers/useAuth";
import assignmentService from "../../../services/assignments";

export const Assignment = ({
  assignment,
  setCurrentAssignmentId,
  currentAssignmentId,
  setLeaderboardData,
}) => {
  const [isOverdue, setIsOverdue] = useState(
    new Date(assignment.dueDate) < new Date()
  );
  const { jwt } = useAuth();

  const handleClick = async () => {
    setCurrentAssignmentId(assignment.id);
    try {
      // Need to optimise!
      const leaderboardData = await assignmentService.getLeaderboardData(
        jwt,
        assignment.id
      );
      const formattedData = leaderboardData.map((a) => a.submission);
      setLeaderboardData(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      elevation={1}
      sx={{ m: 2, border: currentAssignmentId === assignment.id ? 1 : null }}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography>{assignment.assignmentName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end">
                {isOverdue ? (
                  <Typography color="red">{`Overdue: ${assignment.dueDate.substring(
                    0,
                    10
                  )}`}</Typography>
                ) : (
                  <Typography>{`Due: ${assignment.dueDate.substring(
                    0,
                    10
                  )}`}</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
