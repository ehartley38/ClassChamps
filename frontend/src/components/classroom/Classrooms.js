import { useEffect, useState, useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../providers/UserProvider"
import classroomService from '../../services/classrooms'
import { ClassroomPanel } from './ClassroomPanel'

export const Classrooms = () => {
    const [classrooms, setClassrooms] = useState([])
    const [user, setUser] = useContext(UserContext)


    useEffect(() => {
        const fetchClassrooms = async () => {
            classroomService.setToken(user.token)
            const classroomArray = await classroomService.getAll();
            setClassrooms(classroomArray);
        };

        fetchClassrooms();
    }, []);

    const deleteClassroom = async (room) => {
        await classroomService.deleteClassroom(room)

        const updatedClassrooms = classrooms.filter(c => c.id !== room.id)
        setClassrooms(updatedClassrooms)
    }

    return (
        <div>
            <button>
                <NavLink to='new'>Create new Classroom</NavLink>
            </button>
            <div>
                <h1>Your Classrooms</h1>
                {classrooms && classrooms.map(classroom =>
                    <ClassroomPanel key={classroom.id} classroom={classroom} deleteClassroom={deleteClassroom}/>
                    )}
            </div>
        </div>
    )
}