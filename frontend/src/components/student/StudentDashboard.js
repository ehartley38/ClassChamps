import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { JoinRoom } from './JoinRoom';
import { StudentClassroomPanel } from './classroom/StudentClassroomPanel';
import { Box, Container, Grid, Typography } from '@mui/material';
import useAuth from '../../providers/useAuth';
import classroomService from '../../services/classrooms'


export const StudentDashboard = () => {
    let navigate = useNavigate()
    const { user, loading, error, jwt } = useAuth()
    const [classrooms, setClassrooms] = useState([])


    useEffect(() => {
        if (user && user.role === 'teacher') {
            navigate('/teacher')
        } else {
            
        }
        const fetchClassrooms = async () => {
            const classroomArray = await classroomService.getAllStudentClassrooms(jwt);
            setClassrooms(classroomArray);
        };

        fetchClassrooms();
        
    }, [user])


    if (user && user.role !== 'teacher') return (
        
        <div>
            <Typography variant='h1' sx={{ my: 4, textAlign: 'center', color: 'primary.main' }}>Student Dashboard</Typography>
            Welcome {user.name}
            <Typography variant='h3' sx={{ color: 'secondary.main' }} >Your classrooms</Typography>
            <Container sx={{ py: 4 }} >
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center', gap: 4 }}>
                            {classrooms.map(classroom =>
                                <StudentClassroomPanel key={classroom.id} classroom={classroom} />
                            )}
                            <JoinRoom />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}