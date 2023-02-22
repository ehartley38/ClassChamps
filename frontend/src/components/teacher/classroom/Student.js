import classroomService from '../../../services/classrooms'

export const Student = ({ student, classroom, setClassroom }) => {
    const jwt = window.localStorage.getItem('loggedAppUser')

    const handleDelete = async () => {
        await classroomService.removeStudentFromClassroom(JSON.parse(jwt), classroom.id, student.id)

        const updatedClassroom = { ...classroom }
        updatedClassroom.students = classroom.students.filter(s => s.id !== student.id)
        setClassroom(updatedClassroom)
    }

    return (
        <div>
            {student.name}
            <button onClick={handleDelete}>Remove</button>
        </div>
    )
}