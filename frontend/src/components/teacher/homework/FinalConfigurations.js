import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

export const FinalConfigurations = ({ quizName, setQuizName }) => {
  return (
    <>
      <h1>Quiz Name</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <form>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quiz Name"
              value={quizName}
              onChange={({ target }) => setQuizName(target.value)}
            ></TextField>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
