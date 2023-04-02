import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

export const SignOut = () => {
  let navigate = useNavigate();
  const { signOut, jwt } = useAuth();
  const logout = useLogout();

  const logoutUser = async () => {
    //signOut();
    await logout();
    //navigate("/login");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={() => logoutUser()}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Logout
        </Button>
      </Box>
    </>
  );
};
