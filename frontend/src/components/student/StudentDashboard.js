import {  useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../providers/UserProvider";
import  usersService from '../../services/users'
import { SignOut } from '../SignOut';
import { TeacherDashboard } from '../teacher/TeacherDashbaord';
import { JoinRoom } from './JoinRoom';
import { StudentClassroomPanel } from './StudentClassroomPanel';

export const StudentDashboard = () => {
    const [user, setUser] = useContext(UserContext)
    const [userDetails, setUserDetails] = useState(null)
    let navigate = useNavigate()

    const jwt = window.localStorage.getItem('loggedAppUser')

    

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const details = await usersService.getUserDetails(JSON.parse(jwt))
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
            <h1>Student Dashboard</h1>
            Welcome {userDetails.name}
            <h3>Your classrooms</h3>
            {userDetails.classrooms.map(classroom =>
                <StudentClassroomPanel key={classroom.id} classroom={classroom} />
                )}
            <JoinRoom />
            <SignOut />
        </div>
    )
}