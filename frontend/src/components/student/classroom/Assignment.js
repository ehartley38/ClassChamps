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
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const Assignment = ({
  assignment,
  setCurrentAssignmentId,
  currentAssignmentId,
  setLeaderboardData,
  complete,
}) => {
  const [isOverdue, setIsOverdue] = useState(
    new Date(assignment.dueDate) < new Date()
  );
  const axiosPrivate = useAxiosPrivate();

  const handleClick = async () => {
    setCurrentAssignmentId(assignment.id);
    try {
      // Need to optimise!
      const leaderboardResponse = await axiosPrivate.get(
        `/assignments/leaderboard/${assignment.id}`
      );
      const leaderboardData = leaderboardResponse.data;

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
                {complete ? (
                  <></>
                ) : isOverdue ? (
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
