import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../providers/UserProvider"

export const SignOut = () => {
    const [user, setUser] = useContext(UserContext)
    let navigate = useNavigate()

    const logoutUser = () => {
      window.localStorage.removeItem('loggedAppUser')
      setUser(null)
      navigate('/login')
    }

    return (
        <div>
      <button onClick={() => logoutUser()}>Sign Out</button>
    </div>
    )
}