import { useState } from "react"
import { useNavigate } from "react-router-dom"
import classroomService from '../../services/classrooms'


export const JoinRoom = () => {
    const [joinCode, setJoinCode] = useState('')
    const jwt = window.localStorage.getItem('loggedAppUser')

    let navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const classroom = await classroomService.joinClassByRoomCode(JSON.parse(jwt), joinCode)
        if (classroom !== 'Invalid room code') {
            // Navigate to classroom
            navigate(`${classroom.roomName}`, { state: { classroom } })
        }

        // If code is valid, then navigate to the classroom. Else, throw error
    }

    return (
        <div>
            <h3>Enter your classroom code here</h3>
            <form onSubmit={handleSubmit}>
                <input
                    id="join-code"
                    value={joinCode}
                    onChange={({ target }) => setJoinCode(target.value)}
                />
                <button type="submit">Join</button>
            </form>
        </div>

    )
}