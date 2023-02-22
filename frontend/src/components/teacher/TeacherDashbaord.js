import { NavLink } from "react-router-dom"
import { SignOut } from "../SignOut"
import { useState, useEffect } from "react"
import  usersService from '../../services/users'


export const TeacherDashboard = () => {
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
            <div>
                <h1>TeacherDashboard</h1>
                <h3> Welcome {userDetails.username} </h3>

                <button>
                    <NavLink to='classrooms'>Classrooms</NavLink>
                </button>

                <SignOut />
            </div>
        )
    }

}