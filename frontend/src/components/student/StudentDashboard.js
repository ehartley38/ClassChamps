import { useEffect, useState } from "react";
import { JoinRoom } from "./JoinRoom";
import { StudentClassroomPanel } from "./classroom/StudentClassroomPanel";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import classroomService from "../../services/classrooms";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
  const { user, auth } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [userData, setUserData] = useState([]);
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const userData = await axiosPrivate.get("/api/users/id");
        setUserData(userData.data);

        const classroomArray = await axiosPrivate.get(
          "/api/classrooms/studentClassrooms"
        );
        setClassrooms(classroomArray.data);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      } finally {
      }
    };

    fetchClassrooms();
  }, []);

  if (classrooms && userData) {
    return (
      <div>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Student Dashboard
        </Typography>
        <Typography variant="h6">Welcome {userData.name}</Typography>
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
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    );
  }
};
