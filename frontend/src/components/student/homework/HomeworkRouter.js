import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PlayBingo } from "./PlayBingo";

export const HomeworkRouter = () => {
  const location = useLocation();

  if (location.state.assignment.quizId.quizType === "Bingo")
    return <PlayBingo assignment={location.state.assignment} />;

  return <>Quiz type not found</>;
};
