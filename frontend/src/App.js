import { useState, useContext } from 'react'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { SignUp } from './components/SignUp'
import { UserContext } from "./providers/UserProvider";


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorNotification, setErrorNotification] = useState(null)

  const [user, setUser] = useContext(UserContext)

  const logoutUser = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginUser = await loginService.login({ username, password })

      window.localStorage.setItem('loggedAppUser', JSON.stringify(loginUser))
      setUser(loginUser)
      setUsername('')
      setPassword('')
    } catch (err) {
      console.log(err);

    }
  }

  if (!user) {
    return (
      <div>
        <Notification message={errorNotification} className={"error"} />
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
        <SignUp />
      </div>
    )
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>{user.username} has logged in</h3>
      <button onClick={logoutUser}>Logout</button>
    </div>
  )
}

export default App