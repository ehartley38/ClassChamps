import { useLocation } from "react-router-dom"
import classroomService from '../../../services/classrooms'
import assignmentService from '../../../services/assignments'
import useAuth from "../../../providers/useAuth"
import { useState, useEffect } from "react"
import { StudentHomeworkPanel } from "./StudentHomeworkPanel"
import { Grid, List } from "@mui/material"

export const StudentClassroomView = () => {
    const location = useLocation()
    const classroomObject = location.state.classroom
    const [activeHomework, setActiveHomework] = useState()
    const { jwt } = useAuth()

    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const assignmentData = await assignmentService.getByClassroom(jwt, classroomObject.id)
                setActiveHomework(assignmentData)
            } catch (err) {
                console.log(err);
            }
        }

        fetchClassroomData()
    }, [])

    return (
        <>
            <h1>{classroomObject.roomName}</h1>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h3>Due homework</h3>
                    {activeHomework && activeHomework.map((assignment) =>
                        <StudentHomeworkPanel key={assignment.id} assignment={assignment} />
                    )}
                    <h3>Complete homework</h3>
                </Grid>
            </Grid>
        </>
    )
}