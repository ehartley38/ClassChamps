import { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ClassroomPanel } from "./ClassroomPanel";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

export const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosPrivate.get("/classrooms/teacherClassrooms");
      setClassrooms(response.data);
    };

    fetchData();
  }, []);

  const deleteClassroom = async (room) => {
    const response = await axiosPrivate.delete(`/classrooms/${room.id}`);

    const updatedClassrooms = classrooms.filter((c) => c.id !== room.id);
    setClassrooms(updatedClassrooms);
  };

  return (
    classrooms && (
      <>
        <Typography variant="h2" sx={{ color: "primary.main", my: 2 }}>
          Your Classrooms
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            {/* List the teachers created classrooms here */}
            {classrooms &&
              classrooms.map((classroom) => (
                <ClassroomPanel
                  key={classroom.id}
                  classroom={classroom}
                  deleteClassroom={deleteClassroom}
                />
              ))}

            {/* Create a new classroom */}
            <Grid item xs={12} sx={{ width: "100%", py: 1 }}>
              <Paper
                elevation={3}
                sx={{
                  height: 130,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Box textAlign="center" sx={{ pb: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("new")}
                  >
                    Create New
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  );
};
