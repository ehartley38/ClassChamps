import { Box, Button } from "@mui/material";
import useLogout from "../hooks/useLogout";

export const SignOut = () => {
  const logout = useLogout();

  const logoutUser = async () => {
    await logout();
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
