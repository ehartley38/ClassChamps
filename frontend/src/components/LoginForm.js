import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
    
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
                <button type="submit">login</button>
            </form>
        </div>
    )

}

export default LoginForm