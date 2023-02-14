import { useEffect, useState, useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../providers/UserProvider"
import classroomService from '../../services/classrooms'
import { ClassroomPanel } from './ClassroomPanel'

export const Classrooms = () => {
    const [classrooms, setClassrooms] = useState([])
    const user = useContext(UserContext)

    useEffect(() => {
        setClassrooms([])
        const fetchClassrooms = async () => {
            const classroomArray = await classroomService.getAll();
            setClassrooms(classroomArray);
        };

        fetchClassrooms();
    }, []);

    const deleteClassroom = async (room) => {


    }

    return (
        <div>
            <button>
                <NavLink to='new'>Create new Classroom</NavLink>
            </button>
            <div>
                <h1>Your Classrooms</h1>
                {classrooms && classrooms.map(classroom =>
                    <ClassroomPanel key={classroom.id} classroom={classroom} />
                    )}
            </div>
        </div>
    )
}