import useAuth from "../../../hooks/useAuth";
import classroomService from "../../../services/classrooms";

export const Student = ({ student, classroom, setClassroom }) => {
  const { jwt } = useAuth();

  const handleDelete = async () => {
    await classroomService.removeStudentFromClassroom(
      jwt,
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
