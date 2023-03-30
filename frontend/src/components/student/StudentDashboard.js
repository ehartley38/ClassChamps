import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JoinRoom } from "./JoinRoom";
import { StudentClassroomPanel } from "./classroom/StudentClassroomPanel";
import { Box, Container, Grid, Typography } from "@mui/material";
import classroomService from "../../services/classrooms";
import { Loading } from "../Loading";
import useAuth from "../../hooks/useAuth";

export const StudentDashboard = () => {
  let navigate = useNavigate();
  const { auth, userDetails } = useAuth();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    if (userDetails && userDetails.role === "teacher") {
      navigate("/teacher");
    }

    const fetchClassrooms = async () => {
      try {
        const classroomArray = await classroomService.getAllStudentClassrooms(
          auth.jwt
        );
        setClassrooms(classroomArray);
      } catch (err) {
      } finally {
      }
    };

    fetchClassrooms();
  }, [userDetails]);

  if (userDetails && userDetails.role !== "teacher" && classrooms) {
    return (
      <div>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Student Dashboard
        </Typography>
        Welcome {userDetails.name}
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
              {classrooms.map((classroom) => (
                <StudentClassroomPanel
                  key={classroom.id}
                  classroom={classroom}
                />
              ))}
              <JoinRoom />
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }
};
