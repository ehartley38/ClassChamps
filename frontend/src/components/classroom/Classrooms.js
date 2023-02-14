import { useEffect, useState, useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../providers/UserProvider";

export const Classrooms = () => {
    const [classrooms, setClassrooms] = useState([])
    const user = useContext(UserContext)

    useEffect(() => {
        const fetchClassroomData = async () => {
            
        }
        fetchClassroomData()
    }, [])
    
    const deleteClassroom = async (room) => {
        

    }

    return (
        <div>
            <button>
                <NavLink to='new'>Create new Classroom</NavLink>
            </button>
            <div>
                <h1>Your Classrooms</h1>
            </div>
        </div>
    )
}