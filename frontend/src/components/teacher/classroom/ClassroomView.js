import { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { UserContext } from "../../../providers/UserProvider"
import classroomService from '../../../services/classrooms'
import { Student } from "./Student"


export const ClassroomView = () => {
    const location = useLocation()
    const classroomObject = location.state.classroom
    const [classroom, setClassroom] = useState()
    const [user, setUser] = useContext(UserContext)


    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const data = await classroomService.getById(user, classroomObject.id)
                setClassroom(data)
            } catch (err) {
                console.log(err);
            }
        }

        fetchClassroomData();
    }, []);

    const handleGenerate = async () => {
        try {
            const updatedClassroom = await classroomService.generateClassCode(user, classroomObject)
            setClassroom(updatedClassroom)
        } catch (err) {
            console.log(err);
        }

    }

    if (classroom) return (
        <div>
            <h1>{classroom.roomName}</h1>
            {classroom.roomCode ? (
                <> Your unique room code is {<b>{classroom.roomCode}</b>}</>
            ) : (
                <>Generate your unique room code</>
            )}

            <button onClick={() => handleGenerate()}>{classroom.roomCode ? ('New code') : ('Generate')}</button>
            <div>
                <h3>Students</h3>
                {classroom.students && classroom.students.map((student) =>
                    <Student key={student.id} student={student} classroom={classroom} setClassroom={setClassroom} />
                    )}
            </div>
            <div>
                <h3>Quizzes</h3>
                <i>List of quizzes associated with this class</i>
            </div>
        </div>
    )

}