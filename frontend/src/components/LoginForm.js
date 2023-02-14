import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import classroomService from '../services/classrooms'


const LoginForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
    
        try {
          const loginUser = await loginService.login({ username, password })
    
          window.localStorage.setItem('loggedAppUser', JSON.stringify(loginUser))
          setUser(loginUser)
          setUsername('')
          setPassword('')

          navigate('/')
        } catch (err) {
          console.log(err);
    
        }
      }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">Sign in</button>
            </form>
            <div>
                Dont have an account?
                <button>
                    <NavLink to='/'>Click here</NavLink>
                </button>
            </div>
        </div>
    )

}

export default LoginForm