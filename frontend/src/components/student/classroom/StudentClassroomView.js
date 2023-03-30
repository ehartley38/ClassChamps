import { Link, useLocation, useNavigate } from "react-router-dom";
import classroomService from "../../../services/classrooms";
import assignmentService from "../../../services/assignments";
import submissionService from "../../../services/assignmentSubmissions";
import { useState, useEffect } from "react";
import { Assignment } from "./Assignment";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { convertMilliseconds } from "../../../utils/tools";
import { LeaderboardItem } from "./LeaderboardItem";
import { FixedSizeList } from "react-window";
import useAuth from "../../../hooks/useAuth";

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
  //const { jwt, recentBadges, setRecentBadges } = useAuth();
  const { auth, recentBadges } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const assignmentData = await assignmentService.getByClassroom(
          auth.jwt,
          classroomObject.id
        );
        const submissionData = await submissionService.getAllByUser(auth.jwt);

        setAssignments(assignmentData);
        setSubmissions(submissionData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClassroomData();
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

  // Get assignment using assignmentId
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
    //setRecentBadges([]);
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
      <h1>{classroomObject.roomName}</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <h3>Due</h3>
          {assignments &&
            assignments.map((assignment) => {
              // If the assignment has already been submitted, dont render here.
              if (
                submissions &&
                submissions.find(
                  (submission) => submission.assignment.id === assignment.id
                )
              ) {
                return;
              }
              return (
                <Assignment
                  key={assignment.id}
                  assignment={assignment}
                  setCurrentAssignmentId={setCurrentAssignmentId}
                  currentAssignmentId={currentAssignmentId}
                  setLeaderboardData={setLeaderboardData}
                />
              );
            })}
          <h3>Complete</h3>
          {completedAssignments &&
            completedAssignments.map((assignment) => (
              <Assignment
                key={assignment.id}
                assignment={assignment}
                setCurrentAssignmentId={setCurrentAssignmentId}
                currentAssignmentId={currentAssignmentId}
                setLeaderboardData={setLeaderboardData}
              />
            ))}
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
          <TabPanel value={tabValue} index={0}>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {leaderboardData &&
                leaderboardData.map((submission, index) => (
                  <LeaderboardItem
                    key={index}
                    submission={submission}
                    index={index}
                  />
                ))}
            </List>
          </TabPanel>
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
              })}
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
};
