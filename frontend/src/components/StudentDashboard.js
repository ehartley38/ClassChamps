import {  useContext, useEffect, useState } from 'react'
import { UserContext } from "../providers/UserProvider";
import  usersService from '../services/users'
import { SignOut } from './SignOut';
import { TeacherDashboard } from './TeacherDashbaord';
import { JoinRoom } from './JoinRoom';
import { StudentClassroomPanel } from './student/StudentClassroomPanel';

export const StudentDashboard = () => {
    const [user, setUser] = useContext(UserContext)
    const [userDetails, setUserDetails] = useState(null)

    const jwt = window.localStorage.getItem('loggedAppUser')

    const fetchUserDetails = async () => {
        try {
            const details = await usersService.getUserDetails(JSON.parse(jwt))
            setUserDetails(details)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, [])

    if (userDetails && userDetails.role === 'teacher') {
        return (
            <TeacherDashboard userDetails={userDetails}/>
        )
    }
    

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