import { NavLink } from "react-router-dom";
import { SignOut } from "../SignOut";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardActionArea,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const TeacherDashboard = () => {
  const [userData, setUserData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axiosPrivate.get("/users/id");
      setUserData(userData.data);
    };
    fetchData();
  }, []);

  return (
    userData && (
      <>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Teacher Dashboard
        </Typography>
        <Typography variant="h6">Welcome {userData.name}</Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <Button variant="outlined">
              <NavLink to="classrooms" style={{ textDecoration: "none" }}>
                Your Classrooms
              </NavLink>
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined">
              <NavLink to="homework" style={{ textDecoration: "none" }}>
                Your Quizzes
              </NavLink>
            </Button>
          </Grid>
        </Grid>
      </>
    )
  );
};
