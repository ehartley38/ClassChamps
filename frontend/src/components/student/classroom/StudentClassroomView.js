import { Link, useLocation, useNavigate } from "react-router-dom"
import classroomService from '../../../services/classrooms'
import assignmentService from '../../../services/assignments'
import submissionService from '../../../services/assignmentSubmissions'
import useAuth from "../../../providers/useAuth"
import { useState, useEffect } from "react"
import { Assignment } from "./Assignment"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Grid, List, Tab, Tabs, Typography } from "@mui/material"
import { convertMilliseconds } from "../../../utils/tools"

const TabPanel = ({ value, index, children }) => {

    return (
        <div
            hidden={value !== index}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </div>
    );
}


export const StudentClassroomView = () => {
    const location = useLocation()
    const classroomObject = location.state.classroom
    const [assignments, setAssignments] = useState() // This contains ALL assignments
    const [completedAssignments, setCompletedAssignments] = useState([]) // This contains ONLY completed assignments
    const [submissions, setSubmissions] = useState()
    const [tabValue, setTabValue] = useState(0)
    const [currentAssignmentId, setCurrentAssignmentId] = useState(undefined)
    const { jwt } = useAuth()
    let navigate = useNavigate()

    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const assignmentData = await assignmentService.getByClassroom(jwt, classroomObject.id)
                const submissionData = await submissionService.getAllByUser(jwt)
                
                setAssignments(assignmentData)
                setSubmissions(submissionData)
            } catch (err) {
                console.log(err);
            }
        }

        fetchClassroomData()
    }, [])

    // Update the completed assignmetns list
    useEffect(() => {
        const completed = []
        if (assignments && submissions) {
            assignments.forEach((assignment) => {
                const submission = submissions.find((submission) => submission.assignment.id === assignment.id)
                if (submission) {
                    completed.push(assignment)
                }
            })
            setCompletedAssignments(completed)
        }
    }, [assignments, submissions])

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue)
    }

    // Get assignment using assignmentId
    const getAssignment = (id) => {
        return assignments.find((assignment) => assignment.id === id)
    }

    const handlePlay = () => {
        const assignment = getAssignment(currentAssignmentId)
        navigate(`homework/${assignment.id}`, { state: { assignment } })
    }

    return (
        <>
            <h1>{classroomObject.roomName}</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <h3>Due</h3>
                    {assignments && assignments.map((assignment) => {
                        // If the assignment has already been submitted, dont render here.
                        if (submissions && submissions.find((submission) => submission.assignment.id === assignment.id)) {
                            return
                        }
                        return (
                            <Assignment key={assignment.id} assignment={assignment}
                                setCurrentAssignmentId={setCurrentAssignmentId} />
                        )
                    }
                    )}
                    <h3>Overdue</h3>
                    <h3>Complete</h3>
                    {completedAssignments && completedAssignments.map((assignment) =>
                        <Assignment key={assignment.id} assignment={assignment}
                            setCurrentAssignmentId={setCurrentAssignmentId} />
                    )}
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={handlePlay}>Play</Button>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Leaderboard" />
                            <Tab label="Your Submissions" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <Box>
                            Leaderboard
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {submissions && submissions.map((submission) => {
                            if (submission.assignment.id === currentAssignmentId) {
                                return (
                                    <Card key={submission.id} elevation={1} sx={{ my: 1 }}>
                                        <Typography>Date Completed: {submission.submissionDate.substring(0, 19)}</Typography>
                                        <Typography>Time: {convertMilliseconds(Date.parse(submission.timeToComplete))}</Typography>
                                    </Card>
                                )
                            }
                        })}
                    </TabPanel>
                </Grid>
            </Grid>
        </>
    )
}