import { useContext } from "react";
import classroomService from "../../../services/classrooms";
import useAuth from "../../../hooks/useAuth";

export const Student = ({ student, classroom, setClassroom }) => {
  const { auth } = useAuth();

  const handleDelete = async () => {
    await classroomService.removeStudentFromClassroom(
      auth.jwt,
      classroom.id,
      student.id
    );

    const updatedClassroom = { ...classroom };
    updatedClassroom.students = classroom.students.filter(
      (s) => s.id !== student.id
    );
    setClassroom(updatedClassroom);
  };

  return (
    <div>
      {student.name}
      <button onClick={handleDelete}>Remove</button>
    </div>
  );
};
