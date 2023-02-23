import { useNavigate } from "react-router-dom"



export const ClassroomPanel = ({ classroom, deleteClassroom }) => {
    let navigate = useNavigate()

    const handleDetails = () => {
        navigate(`${classroom.roomName}`, { state: { classroom } })
    }

    return (
        <div>
            <h3>{classroom.roomName}</h3>
            <button onClick={() => handleDetails()}>Details</button>
            <button onClick={() => deleteClassroom(classroom)}>Delete</button>
        </div>
    )
}