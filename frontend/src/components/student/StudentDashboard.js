import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../providers/UserProvider";
import usersService from '../../services/users'
import { SignOut } from '../SignOut';
import { JoinRoom } from './JoinRoom';
import { StudentClassroomPanel } from './classroom/StudentClassroomPanel';
import { Box, Container, Grid, Typography } from '@mui/material';

export const StudentDashboard = () => {
    const [user, setUser] = useContext(UserContext)
    const [userDetails, setUserDetails] = useState(null)
    let navigate = useNavigate()

    useEffect(() => {
        if (!user) return;
        const fetchUserDetails = async () => {
            try {
                const details = await usersService.getUserDetails(user)
                if (details.role === 'teacher') {
                    navigate('/teacher')
                } else {
                    setUserDetails(details)
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchUserDetails()
    }, [])


    if (userDetails) return (
        <div>
            <Typography variant='h1' sx={{ my: 4, textAlign: 'center', color: 'primary.main' }}>Student Dashboard</Typography>
            Welcome {userDetails.name}
            <Typography variant='h3' sx={{ color: 'secondary.main' }} >Your classrooms</Typography>
            <Container sx={{ py: 4 }} >
                <Grid container>
                    <Grid xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center', gap: 4 }}>
                            {userDetails.classrooms.map(classroom =>
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