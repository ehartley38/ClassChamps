import { useEffect, useState } from "react";
import { JoinRoom } from "./JoinRoom";
import { StudentClassroomPanel } from "./classroom/StudentClassroomPanel";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [userData, setUserData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const userData = await axiosPrivate.get("/users/id");
        setUserData(userData.data);

        const classroomArray = await axiosPrivate.get(
          "/classrooms/studentClassrooms"
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
      <>
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
          <Grid
            item
            container
            sx={{ py: 2 }}
            spacing={4}
            xs={12}
            justifyContent="center"
          >
            {classrooms.map((classroom) => (
              <StudentClassroomPanel key={classroom.id} classroom={classroom} />
            ))}
            <JoinRoom />
          </Grid>
        </Grid>
      </>
    );
  }
};
