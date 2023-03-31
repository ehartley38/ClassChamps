import { useEffect, useState } from "react";
import { JoinRoom } from "./JoinRoom";
import { StudentClassroomPanel } from "./classroom/StudentClassroomPanel";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import classroomService from "../../services/classrooms";

export const StudentDashboard = () => {
  const { user, auth } = useAuth();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const classroomArray = await classroomService.getAllStudentClassrooms(
          auth.accessToken
        );
        setClassrooms(classroomArray);
      } catch (err) {
      } finally {
      }
    };
    if (user !== undefined) fetchClassrooms();
  }, [user, auth]);

  if (classrooms && user) {
    return (
      <div>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Student Dashboard
        </Typography>
        <Typography variant="h6">Welcome {user.name}</Typography>
        <Typography variant="h3" sx={{ color: "secondary.main" }}>
          Your classrooms
        </Typography>
        <Grid container>
          <Grid item xs={12} sx={{ my: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {classrooms ? (
                <>
                  {classrooms.map((classroom) => (
                    <StudentClassroomPanel
                      key={classroom.id}
                      classroom={classroom}
                    />
                  ))}
                  <JoinRoom />
                </>
              ) : (
                <>
                  <Box sx={{ width: "31%" }}>
                    <Skeleton variant="rounded" height={150} sx={{ m: 2 }} />
                  </Box>

                  <Box sx={{ width: "31%" }}>
                    <Skeleton variant="rounded" height={150} sx={{ m: 2 }} />
                  </Box>
                  <Box sx={{ width: "31%" }}>
                    <Skeleton variant="rounded" height={150} sx={{ m: 2 }} />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }
};
