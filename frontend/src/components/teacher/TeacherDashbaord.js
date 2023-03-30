import { NavLink } from "react-router-dom";
import { SignOut } from "../SignOut";
import { useState, useEffect, useContext } from "react";
import usersService from "../../services/users";
import { Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";

export const TeacherDashboard = () => {
  const { userDetails } = useAuth();

  if (userDetails && userDetails.role === "teacher") {
    return (
      <div>
        <Typography
          variant="h1"
          sx={{ my: 4, textAlign: "center", color: "primary.main" }}
        >
          Teacher Dashboard
        </Typography>
        Welcome {userDetails.name} <br></br>
        <button>
          <NavLink to="classrooms">Classrooms</NavLink>
        </button>
        <button>
          <NavLink to="homework">Your Created Homework</NavLink>
        </button>
        <SignOut />
      </div>
    );
  }
};
