import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
  Paper,
  TextField,
  FormControl,
} from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/useAuth";
import { UserContext } from "../../providers/UserProvider";
import classroomService from "../../services/classrooms";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const JoinRoom = () => {
  const [joinCode, setJoinCode] = useState("");
  const [open, setOpen] = useState(false);
  const [isJoinError, setIsJoinError] = useState(undefined);
  const { user, jwt, error } = useAuth();
  let navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const classroom = await classroomService.joinClassByRoomCode(
        jwt,
        joinCode
      );
      if (classroom !== "Invalid room code") {
        // Navigate to classroom
        setIsJoinError(false);
        navigate(`${classroom.roomName}`, {
          state: { classroom, isJoinError: false },
        });
      } else {
        setIsJoinError(true);
      }
    } catch (err) {}

    // If code is valid, then navigate to the classroom. Else, throw error
  };

  // https://mui.com/material-ui/react-modal/
  return (
    <>
      <Box sx={{ width: "31%" }}>
        <Paper
          elevation={3}
          sx={{
            height: 150,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box></Box>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOpen()}
            >
              Join Room
            </Button>
          </Box>
        </Paper>
        {/* Modal */}
        <Box textAlign="center" alignItems="center">
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={modalStyle} textAlign="center">
                <Typography
                  variant="h3"
                  sx={{ my: 4, textAlign: "center", color: "secondary.main" }}
                >
                  Enter classroom code{" "}
                </Typography>
                <form onSubmit={handleSubmit}>
                  {isJoinError ? (
                    <TextField
                      id="joinCode"
                      value={joinCode}
                      variant="outlined"
                      onChange={({ target }) => setJoinCode(target.value)}
                      error
                      helperText="Invalid room code"
                    />
                  ) : (
                    <TextField
                      id="joinCode"
                      value={joinCode}
                      variant="outlined"
                      onChange={({ target }) => setJoinCode(target.value)}
                    />
                  )}

                  <Box textAlign="center" sx={{ m: 2 }}>
                    <Button type="submit" variant="contained">
                      Join
                    </Button>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>
        </Box>
      </Box>
    </>
  );
};
