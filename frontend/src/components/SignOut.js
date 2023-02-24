import { Box, Button } from "@mui/material"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../providers/useAuth"
import { UserContext } from "../providers/UserProvider"
import classroomService from '../services/classrooms'

export const SignOut = () => {
  let navigate = useNavigate()
  const { signOut, jwt } = useAuth()

  const logoutUser = () => {
    signOut()
    navigate('/login')
  }

  return (
    <>
     <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Button onClick={() => logoutUser()} sx={{ my: 2, color: 'white', display: 'block' }} >
        Logout
      </Button>
    </Box>
    </>
   
  )
}