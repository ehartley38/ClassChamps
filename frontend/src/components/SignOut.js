import { useContext } from "react"
import { UserContext } from "../providers/UserProvider"

export const SignOut = () => {
    const [user, setUser] = useContext(UserContext)

    const logoutUser = () => {
      window.localStorage.removeItem('loggedAppUser')
      setUser(null)
    }

    return (
        <div>
      <button onClick={() => logoutUser()}>Sign Out</button>
    </div>
    )
}