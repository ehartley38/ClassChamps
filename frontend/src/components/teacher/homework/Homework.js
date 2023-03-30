import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import quizzesService from "../../../services/quizzes";
import { QuizPanelList } from "./QuizListPanel";
import useAuth from "../../../hooks/useAuth";

export const Homework = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesArray = await quizzesService.getAll(auth.jwt);
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
