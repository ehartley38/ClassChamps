import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const Student = ({ student, classroom, setClassroom }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    // Remove student from a classroom
    await axiosPrivate.put(
      `/classrooms/${classroom.id}/removeUser/${student.id}`
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
