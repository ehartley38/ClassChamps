import { useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../providers/UserProvider"
import classroomService from '../../services/classrooms'


export const JoinRoom = () => {
    const [joinCode, setJoinCode] = useState('')
    const [user, setUser] = useContext(UserContext)
    
    //const jwt = useMemo(()=>useNavigate(), [useNavigate])
    let navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const classroom = await classroomService.joinClassByRoomCode(user, joinCode)
        if (classroom !== 'Invalid room code') {
            // Navigate to classroom
            navigate(`${classroom.roomName}`, { state: { classroom } })
        }

        // If code is valid, then navigate to the classroom. Else, throw error
    }

    /*
    const handleSubmitC = useCallback( async (e)=>{
        if(!user) return;
        e.preventDefault()

        const classroom = await classroomService.joinClassByRoomCode(user, joinCode)
        if (classroom !== 'Invalid room code') {
            // Navigate to classroom
            navigate(`${classroom.roomName}`, { state: { classroom } })
        }

        // If code is valid, then navigate to the classroom. Else, throw error
    }, [user])*/

    return (
        <>
            <h3>Enter your classroom code here</h3>
            <form onSubmit={handleSubmit}>
                <input
                    id="join-code"
                    value={joinCode}
                    onChange={({ target }) => setJoinCode(target.value)}
                />
                <button type="submit">Join</button>
            </form>
        </>

    )
}