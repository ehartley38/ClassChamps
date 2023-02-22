import { useLocation } from "react-router-dom"

export const StudentClassroomView = () => {
    const location = useLocation()
    const classroomObject = location.state.classroom

    return (
        <h1>{classroomObject.roomName}</h1>
    )
}