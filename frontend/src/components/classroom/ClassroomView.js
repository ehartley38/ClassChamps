import { useLocation } from "react-router-dom"
import classroomService from '../../services/classrooms'


export const ClassroomView = () => {
    const location = useLocation()
    const classroom = location.state.classroom

    const jwt = window.localStorage.getItem('loggedAppUser')

    const handleGenerate = async () => {
        try {
            await classroomService.generateClassCode(JSON.parse(jwt), classroom)
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div>
            <h1>{classroom.roomName}</h1>
            Generate your invite code here
            <button onClick={() => handleGenerate()}>Generate</button>
            <div>
                <h3>Students</h3>
                <i>List of students</i>
            </div>
            <div>
                <h3>Quizzes</h3>
                <i>List of quizzes associated with this class</i>
            </div>
        </div>
    )
}