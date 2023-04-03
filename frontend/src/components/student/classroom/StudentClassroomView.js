import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Assignment } from "./Assignment";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  List,
  Skeleton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { convertMilliseconds } from "../../../utils/tools";
import { LeaderboardItem } from "./LeaderboardItem";
import { FixedSizeList } from "react-window";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const TabPanel = ({ value, index, children }) => {
  return (
    <div hidden={value !== index}>{value === index && <>{children}</>}</div>
  );
};

export const StudentClassroomView = () => {
  const location = useLocation();
  const classroomObject = location.state.classroom;
  const isJoinError = location.state.isJoinError;
  const [assignments, setAssignments] = useState(); // This contains ALL assignments
  const [completedAssignments, setCompletedAssignments] = useState([]); // This contains ONLY completed assignments
  const [submissions, setSubmissions] = useState();
  const [tabValue, setTabValue] = useState(0);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(undefined);
  const [allSubmissions, setAllSubmissions] = useState({}); // This contains all submissions from all users for a given assignment
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [openSnackBar, setOpenSnackbar] = useState(true);
  const [openSuccessfulJoin, setOpenSuccessfulJoin] = useState(
    isJoinError === true || isJoinError === undefined ? false : true
  ); // :/ If no join error, then set successful join message to open
  const { recentBadges, setRecentBadges } = useAuth();
  let navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      const assignmentData = await axiosPrivate.get(
        `/assignments/classroom/${classroomObject.id}`
      );
      const submissionData = await axiosPrivate.get("/assignmentSubmissions");

      setAssignments(assignmentData.data);
      setSubmissions(submissionData.data);
    };

    fetchData();
  }, []);

  // Update the completed assignments list
  useEffect(() => {
    const completed = [];
    if (assignments && submissions) {
      assignments.forEach((assignment) => {
        const submission = submissions.find(
          (submission) => submission.assignment.id === assignment.id
        );
        if (submission) {
          completed.push(assignment);
        }
      });
      setCompletedAssignments(completed);
    }
  }, [assignments, submissions]);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  // Get assignment object using assignmentId
  const getAssignment = (id) => {
    return assignments.find((assignment) => assignment.id === id);
  };

  const handlePlay = () => {
    const assignment = getAssignment(currentAssignmentId);
    navigate(`homework/${assignment.id}`, {
      state: { assignment: assignment },
    });
  };

  const handleSnackClose = () => {
    setOpenSnackbar(false);
    setRecentBadges([]);
  };

  const handleSuccessfulJoinClose = () => {
    setOpenSuccessfulJoin(false);
  };

  return (
    <>
      {/* Display successful join message */}
      {!isJoinError ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSuccessfulJoin}
          onClose={handleSuccessfulJoinClose}
        >
          <Alert severity="success">
            Successfully joined {classroomObject.roomName}!
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      {/* Display recently earned badges */}
      {recentBadges.length > 0 ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBar}
          onClose={handleSnackClose}
        >
          <Alert
            severity="success"
            onClick={() => {
              setRecentBadges([]);
              navigate("/profile/badges");
            }}
            sx={{ cursor: "pointer" }}
          >
            {`You have ${recentBadges.length} new badge${
              recentBadges.length > 1 ? "'s!" : "!"
            }`}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      {/* Main content */}
      <Typography variant="h2" sx={{ color: "primary.main", mt: 2 }}>
        {classroomObject.roomName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {assignments ? (
            assignments.map((assignment) => {
              // If the assignment has already been submitted, dont render here.
              if (
                submissions &&
                submissions.find(
                  (submission) => submission.assignment.id === assignment.id
                )
              ) {
                return <></>;
              }
              return (
                <>
                  <Typography
                    variant="h3"
                    sx={{ color: "secondary.main", mt: 2 }}
                  >
                    Due
                  </Typography>
                  <Assignment
                    key={assignment.id}
                    assignment={assignment}
                    setCurrentAssignmentId={setCurrentAssignmentId}
                    currentAssignmentId={currentAssignmentId}
                    setLeaderboardData={setLeaderboardData}
                  />
                </>
              );
            })
          ) : (
            <>
              <Skeleton variant="rounded" width={40} sx={{ m: 2 }} />
              <Skeleton variant="rounded" height={50} sx={{ m: 2 }} />{" "}
            </>
          )}
          {assignments ? (
            <>
              <Typography variant="h3" sx={{ color: "secondary.main", mt: 2 }}>
                Complete
              </Typography>
              {completedAssignments.map((assignment) => (
                <Assignment
                  key={assignment.id}
                  assignment={assignment}
                  setCurrentAssignmentId={setCurrentAssignmentId}
                  currentAssignmentId={currentAssignmentId}
                  setLeaderboardData={setLeaderboardData}
                  complete={true}
                />
              ))}
            </>
          ) : (
            <>
              <Skeleton variant="rounded" width={90} sx={{ m: 2 }} />
              <Skeleton variant="rounded" height={50} sx={{ m: 2 }} />
              <Skeleton variant="rounded" height={50} sx={{ m: 2 }} />
            </>
          )}
        </Grid>
        <Grid item xs={4}>
          {currentAssignmentId ? (
            <>
              <Typography variant="h3">
                {getAssignment(currentAssignmentId).assignmentName}
              </Typography>
              <Button
                onClick={handlePlay}
                variant="contained"
                color="success"
                sx={{ my: 1 }}
              >
                Play
              </Button>
            </>
          ) : (
            <div style={{ height: "80px" }}></div>
          )}
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Leaderboard" />
              <Tab label="Your Submissions" />
            </Tabs>
          </Box>
          {/* Leaderboard */}
          <TabPanel value={tabValue} index={0}>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {leaderboardData ? (
                leaderboardData.map((submission, index) => (
                  <LeaderboardItem
                    key={index}
                    submission={submission}
                    index={index}
                  />
                ))
              ) : (
                <>
                  <Skeleton
                    variant="rounded"
                    height={10}
                    width={"50%"}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton sx={{}} />
                  <Skeleton
                    variant="rounded"
                    height={10}
                    width={"50%"}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton sx={{}} />
                </>
              )}
            </List>
          </TabPanel>
          {/* Submissions */}
          <TabPanel value={tabValue} index={1}>
            {submissions &&
              submissions.map((submission) => {
                if (submission.assignment.id === currentAssignmentId) {
                  return (
                    <Card key={submission.id} elevation={1} sx={{ my: 1 }}>
                      <Typography>
                        Date Completed:{" "}
                        {submission.submissionDate.substring(0, 19)}
                      </Typography>
                      <Typography>
                        Time:{" "}
                        {convertMilliseconds(
                          Date.parse(submission.timeToComplete)
                        )}
                      </Typography>
                    </Card>
                  );
                }
                return <></>;
              })}
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
};
