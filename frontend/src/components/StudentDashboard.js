import {  useContext, useEffect, useState } from 'react'
import { UserContext } from "../providers/UserProvider";
import  usersService from '../services/users'
import { SignOut } from './SignOut';
import { TeacherDashboard } from './TeacherDashbaord';

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
    

    return (
        <div>
            <h1>Student Dashboard</h1>
            Welcome {userDetails && userDetails.username}
            <SignOut />
        </div>
    )
}