import { useNavigate } from "react-router-dom"

export const StudentClassroomPanel = ({ classroom }) => {
    let navigate = useNavigate()

    const handleDetails = () => {
        navigate(`${classroom.roomName}`, { state: { classroom } })
    }

    return (
        <div>
            <h3>{classroom.roomName}</h3>
            <button onClick={() => handleDetails()}>Details</button>
        </div>
    )
}