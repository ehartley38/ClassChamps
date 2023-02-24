import { Box, Button } from "@mui/material"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../providers/UserProvider"
import classroomService from '../services/classrooms'

export const SignOut = () => {
  const [user, setUser] = useContext(UserContext)
  let navigate = useNavigate()

  const logoutUser = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
    classroomService.setToken(null)
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