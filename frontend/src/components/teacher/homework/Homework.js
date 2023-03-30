import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import quizzesService from "../../../services/quizzes";
import { QuizPanelList } from "./QuizListPanel";

export const Homework = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { jwt } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesArray = await quizzesService.getAll(jwt);
      setQuizzes(quizzesArray);
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h1>Homework</h1>
      <button>
        <NavLink to="create">Create</NavLink>
      </button>
      <h3>List of homework</h3>
      {quizzes &&
        quizzes.map((quiz) => (
          <QuizPanelList
            key={quiz.id}
            quiz={quiz}
            quizzes={quizzes}
            setQuizzes={setQuizzes}
          />
        ))}
    </div>
  );
};
