import { NavLink } from "react-router-dom"
import { SignOut } from "../SignOut"
import { useState, useEffect, useContext } from "react"
import  usersService from '../../services/users'
import { UserContext } from "../../providers/UserProvider"


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