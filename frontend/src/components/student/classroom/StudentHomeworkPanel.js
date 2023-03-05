import { Button, Card, CardActionArea, CardContent, IconButton, Paper, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

export const StudentHomeworkPanel = ({ assignment }) => {
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        navigate(`homework/${assignment.id}`, { state: { assignment } })
    }

    return (
        <Link
            onClick={handleClick}
            style={{ textDecoration: 'none' }}>
            <Card elevation={1} sx={{ m: 2 }}>
                <CardActionArea>
                    <CardContent>
                        <Typography>{assignment.assignmentName}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    )
}