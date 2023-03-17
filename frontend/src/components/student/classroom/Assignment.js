import { Button, Card, CardActionArea, CardContent, IconButton, Paper, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

export const Assignment = ({ assignment, setCurrentAssignmentId }) => {

    const handleClick = () => {
        setCurrentAssignmentId(assignment.id)
        console.log(assignment.id);
    }

    return (
        <Card elevation={1} sx={{ m: 2 }}>
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography>{assignment.assignmentName}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>

    )
}