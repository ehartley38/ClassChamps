import { useLocation, useParams } from "react-router-dom"

export const ClassroomView = () => {
    const location = useLocation()
    const classroom = location.state.classroom

    return (
        <div>
            <h1>{classroom.roomName}</h1>
            Generate your invite code here
            <button>Generate</button>
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