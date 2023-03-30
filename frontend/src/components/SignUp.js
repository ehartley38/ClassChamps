import { useState, useContext } from "react";
import usersService from "../services/users";
import { NavLink, useNavigate } from "react-router-dom";
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
import useAuth from "../hooks/useAuth";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  //const { signUp } = useAuth();

  let navigate = useNavigate();

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
      console.log("Error - Username and password must match");
      return;
    }

    try {
      //signUp(username, password, name);

      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login");
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
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
};

{
  /* <div>
      <div>
        <form onSubmit={handleSubmit}>
          <h2> Sign up here</h2>
          Name
          <input
            id="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <br />
          Username
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <br />
          Password
          <input
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <br />
          Confirm Password
          <input
            id="confirm-password"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
          />
          <button type="submit">Sign up</button>
        </form>
        <button onClick={handleTestButton}>Test</button>
        <div>
          Already have an account?
          <button>
            <NavLink to="/login">Click here</NavLink>
          </button>
        </div>
      </div>
    </div> */
}
