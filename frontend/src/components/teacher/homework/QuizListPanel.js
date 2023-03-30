import { Button, Typography } from "@mui/material";
import quizzesService from "../../../services/quizzes";
import useAuth from "../../../hooks/useAuth";

export const QuizPanelList = ({ quiz, quizzes, setQuizzes }) => {
  const { auth } = useAuth();

  const handleDelete = async () => {
    await quizzesService.deleteQuiz(auth.jwt, quiz.id);

    const updatedQuizzes = quizzes.filter((q) => q.id !== quiz.id);
    setQuizzes(updatedQuizzes);
  };

  return (
    <>
      <Typography>{quiz.quizName}</Typography>
      <Button onClick={handleDelete}>Delete</Button>
    </>
  );
};
