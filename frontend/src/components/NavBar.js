import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SignOut } from "./SignOut";
import useAuth from "../hooks/useAuth";

export const NavBar = () => {
  const { userDetails } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ClassChamps
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              to={"/"}
              component={Link}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            {userDetails && userDetails.role === "teacher" ? null : (
              <Button
                to={"/profile"}
                component={Link}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Profile
              </Button>
            )}
          </Box>
          <SignOut />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
