import { NavLink } from "react-router-dom"
import { SignOut } from "../SignOut"
import { useState, useEffect, useContext } from "react"
import usersService from '../../services/users'
import { UserContext } from "../../providers/UserProvider"
import { Typography } from "@mui/material"


export const TeacherDashboard = () => {
    const [userDetails, setUserDetails] = useState(null)
    const [user, setUser] = useContext(UserContext)

    const fetchUserDetails = async () => {
        try {
            const details = await usersService.getUserDetails(user)
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
                <Typography variant='h1' sx={{ my: 4, textAlign: 'center', color: 'primary.main' }}>Teacher Dashboard</Typography>
                Welcome {userDetails.name}

                <button>
                    <NavLink to='classrooms'>Classrooms</NavLink>
                </button>

                <SignOut />
            </div>
        )
    }

}