import { Button, Typography } from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const QuizPanelList = ({ quiz, quizzes, setQuizzes }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    await axiosPrivate.delete(`/quizzes/${quiz.id}`);

    const updatedQuizzes = quizzes.filter((q) => q.id !== quiz.id);
    setQuizzes(updatedQuizzes);
  };

  return (
    <>
      {quiz.quizName}
      <Button onClick={handleDelete}>Delete</Button>
      <br></br>
    </>
  );
};
