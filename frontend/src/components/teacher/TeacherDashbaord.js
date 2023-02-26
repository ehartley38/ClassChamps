import { NavLink } from "react-router-dom"
import { SignOut } from "../SignOut"
import { useState, useEffect, useContext } from "react"
import usersService from '../../services/users'
import { Typography } from "@mui/material"
import useAuth from "../../providers/useAuth"


export const TeacherDashboard = () => {
    const { user, loading, error } = useAuth()

    if (user && user.role === 'teacher') {
        return (
            <div>
                <Typography variant='h1' sx={{ my: 4, textAlign: 'center', color: 'primary.main' }}>Teacher Dashboard</Typography>
                Welcome {user.name}

                <button>
                    <NavLink to='classrooms'>Classrooms</NavLink>
                </button>
                <button>
                    
                </button>

                <SignOut />
            </div>
        )
    }

}