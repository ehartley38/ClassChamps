import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { QuizPanelList } from "./QuizListPanel";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Box, Button, Typography } from "@mui/material";

export const Homework = () => {
  const [quizzes, setQuizzes] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      const quizzesArray = await axiosPrivate.get("/quizzes");
      setQuizzes(quizzesArray.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h2" sx={{ color: "primary.main", my: 2 }}>
        Quizzes
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="success">
          <NavLink style={{ textDecoration: "none" }} to="create">
            <Typography color="white">Create New</Typography>
          </NavLink>
        </Button>
      </Box>

      {quizzes &&
        quizzes.map((quiz) => (
          <QuizPanelList
            key={quiz.id}
            quiz={quiz}
            quizzes={quizzes}
            setQuizzes={setQuizzes}
          />
        ))}
    </>
  );
};
