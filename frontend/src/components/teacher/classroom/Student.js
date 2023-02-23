import { useContext } from 'react'
import { UserContext } from '../../../providers/UserProvider'
import classroomService from '../../../services/classrooms'

export const Student = ({ student, classroom, setClassroom }) => {
    const [user, setUser] = useContext(UserContext)


    const handleDelete = async () => {
        await classroomService.removeStudentFromClassroom(user, classroom.id, student.id)

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