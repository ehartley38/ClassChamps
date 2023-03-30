import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import classroomService from "../../../services/classrooms";
import { ClassroomPanel } from "./ClassroomPanel";

export const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const { user, jwt } = useAuth();

  useEffect(() => {
    const fetchClassrooms = async () => {
      const classroomArray = await classroomService.getAll(jwt);
      setClassrooms(classroomArray);
    };

    fetchClassrooms();
  }, []);

  const deleteClassroom = async (room) => {
    await classroomService.deleteClassroom(jwt, room);

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
