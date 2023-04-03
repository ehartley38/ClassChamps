import { NavLink } from "react-router-dom";
import { SignOut } from "../SignOut";
import { useState, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
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
      <div>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Teacher Dashboard
        </Typography>
        Welcome {userData.name} <br></br>
        <button>
          <NavLink to="classrooms">Classrooms</NavLink>
        </button>
        <button>
          <NavLink to="homework">Your Created Homework</NavLink>
        </button>
        <SignOut />
      </div>
    )
  );
};
