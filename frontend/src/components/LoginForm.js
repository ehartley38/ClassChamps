import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

// https://github.com/mui/material-ui/tree/v5.11.11/docs/data/material/getting-started/templates/sign-in

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { setAuth, persist, setPersist } = useAuth();

  let navigate = useNavigate();
  const location = useLocation;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/login",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ username, password, roles, accessToken });

      setUsername("");
      setPassword("");

      const from =
        location.state?.from?.pathname || roles.includes(3000)
          ? "/teacher"
          : "/";

      navigate(from, { replace: true });
    } catch (err) {
      if (err.response.status === 401) {
        setErrorMessage("Username or password incorrect");
        setShowErrorMessage(true);
      }
    }
  };

  const handlePersist = () => {
    setPersist((prev) => !prev);
  };

  const handleUsernameChange = (target) => {
    setUsername(target.value);
    setShowErrorMessage(false);
  };

  const handlePasswordChange = (target) => {
    setPassword(target.value);
    setShowErrorMessage(false);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <Container component="main" maxWidth="xs">
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={({ target }) => handleUsernameChange(target)}
            autoComplete="username"
            autoFocus
          />
          {showErrorMessage ? (
            <TextField
              error
              helperText={errorMessage}
              label="Password"
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={({ target }) => handlePasswordChange(target)}
              autoComplete="current-password"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={({ target }) => handlePasswordChange(target)}
              autoComplete="current-password"
            />
          )}

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            onChange={handlePersist}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item>
              <NavLink to="/register">Don't have an account? Sign Up</NavLink>
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

export default LoginForm;
