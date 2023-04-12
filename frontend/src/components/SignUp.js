import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "../services/axios";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [name, username, password, confirmPassword]);

  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      setErrorMessage("Passwords must match");
      return;
    }

    try {
      const response = await axios.post(
        "/register",
        { username, password, name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login");
    } catch (err) {
      if (err.response.status === 409) {
        setErrorMessage("Username not unique");
      } else {
        setErrorMessage("User Registration Failed");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {errorMessage ? (
        <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      ) : (
        <></>
      )}

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mb: 2,
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
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item>
              <NavLink to="/login">Already have an account? Sign In</NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        <Link color="inherit" href="https://github.com/ehartley38">
          GitHub
        </Link>
      </Typography>
    </Container>
  );
};
