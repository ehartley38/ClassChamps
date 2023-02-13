import { useState, useEffect } from 'react'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)

 

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const logoutUser = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // Set error message popup here
      setErrorNotification('Wrong username or password')
      setTimeout(() => {setErrorNotification(null)}, 5000)

    }
  }


  if (user === null) {
    return (
      <div>
        <Notification message={errorNotification} className={"error"} />
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} /> 
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