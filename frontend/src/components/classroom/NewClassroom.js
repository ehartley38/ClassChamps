import { useContext } from "react"
import { UserContext } from "../../providers/UserProvider";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import classroomService from '../../services/classrooms'


export const NewClassroom = () => {
    const [roomName, setRoomName] = useState('')
    const user = useContext(UserContext)
    let navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Add the classroom
            const returnedClassroom = await classroomService.create({
                roomName: roomName
            })

            // Add the classroom ID to the teachers classrooms array

            
            setRoomName('')
            navigate('/classrooms')
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <h1>Create new classroom</h1>
            <form onSubmit={handleSubmit}>
                Room name
                <input
                    id="roomname"
                    value={roomName}
                    onChange={({ target }) => setRoomName(target.value)}
                />
                <button type="submit">Create Classroom</button>
            </form>
        </div>
    )
}