import { Box, Button, Paper, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

export const StudentClassroomPanel = ({ classroom }) => {
    let navigate = useNavigate()

    const handleDetails = () => {
        navigate(`${classroom.roomName}`, { state: { classroom } })
    }

    return (
        <>
            <Paper elevation={3} sx={{ width: '31%' }}>
                <Typography sx={{ m: 5 }}>{classroom.roomName}</Typography>
                <Box textAlign='center'>
                    <Button variant="contained" onClick={() => handleDetails()}>Enter</Button>
                </Box>
            </Paper>
        </>
    )
}