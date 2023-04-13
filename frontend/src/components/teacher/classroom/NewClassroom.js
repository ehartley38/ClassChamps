import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

export const NewClassroom = () => {
  const [roomName, setRoomName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();

  let navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [roomName]);

  const handleSubmit = async () => {
    if (roomName === "") {
      setErrorMessage("Classroom name cannot be empty");
      return;
    }

    try {
      // Add the classroom
      await axiosPrivate.post("/classrooms", {
        roomName: roomName,
      });

      setRoomName("");
      navigate("/teacher/classrooms");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ width: "100%", py: 1 }}>
          <Typography
            variant="h2"
            sx={{ color: "primary.main", my: 2 }}
            textAlign="center"
          >
            Create New Classroom
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {errorMessage ? (
              <TextField
                error
                label="Error"
                helperText={errorMessage}
                variant="outlined"
                placeholder="Classroom Name"
                value={roomName}
                onChange={({ target }) => setRoomName(target.value)}
              />
            ) : (
              <TextField
                variant="outlined"
                placeholder="Classroom Name"
                value={roomName}
                onChange={({ target }) => setRoomName(target.value)}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
