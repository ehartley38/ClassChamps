import { Button, Card, CardActionArea, CardContent, IconButton, Paper, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../../providers/useAuth"
import assignmentService from '../../../services/assignments'

export const Assignment = ({ assignment, setCurrentAssignmentId, currentAssignmentId }) => {
    const { jwt } = useAuth()

    const handleClick = async () => {
        setCurrentAssignmentId(assignment.id)
        try {
          const leaderboardData = await assignmentService.getLeaderboardData(jwt, assignment.id)  

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Card elevation={1} sx={{ m: 2, border: currentAssignmentId === assignment.id ? 1 : null }} >
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography>{assignment.assignmentName}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}