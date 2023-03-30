import { Button, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import quizzesService from "../../../services/quizzes";

export const QuizPanelList = ({ quiz, quizzes, setQuizzes }) => {
  const { jwt } = useAuth();

  const handleDelete = async () => {
    await quizzesService.deleteQuiz(jwt, quiz.id);

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
