import { useState } from "react"
import classroomService from '../services/classrooms'


export const JoinRoom = () => {
    const [joinCode, setJoinCode] = useState('')
    const jwt = window.localStorage.getItem('loggedAppUser')


    const handleSubmit = (e) => {
        e.preventDefault()

        classroomService.joinClassByRoomCode(JSON.parse(jwt), joinCode)
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