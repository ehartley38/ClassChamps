import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { QuizPanelList } from "./QuizListPanel";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

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
