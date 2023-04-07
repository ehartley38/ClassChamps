import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ClassroomPanel } from "./ClassroomPanel";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const axiosPrivate = useAxiosPrivate();

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
    <div>
      <button>
        <NavLink to="new">Create new Classroom</NavLink>
      </button>
      <div>
        <h1>Your Classrooms</h1>
        {classrooms &&
          classrooms.map((classroom) => (
            <ClassroomPanel
              key={classroom.id}
              classroom={classroom}
              deleteClassroom={deleteClassroom}
            />
          ))}
      </div>
    </div>
  );
};
