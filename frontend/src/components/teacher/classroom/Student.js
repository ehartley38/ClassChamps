import classroomService from '../../../services/classrooms'

export const Student = ({ student, classroom }) => {
    const jwt = window.localStorage.getItem('loggedAppUser')

    const handleDelete = async () => {
        const data = await classroomService.removeStudentFromClassroom(JSON.parse(jwt), classroom.id, student.id)
    }

    return (
        <div>
            {student.name}
            <button onClick={handleDelete}>Remove</button>
        </div>
    )
}