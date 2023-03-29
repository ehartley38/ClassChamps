import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../providers/useAuth";
import {
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  Link,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

// https://github.com/mui/material-ui/tree/v5.11.11/docs/data/material/getting-started/templates/sign-in

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      login(username, password);
      setUsername("");
      setPassword("");

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
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
              <NavLink to="/">Don't have an account? Sign Up</NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
};

export default LoginForm;
