import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../providers/useAuth'
import loginService from '../services/login'


const LoginForm = ({  }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            login(username, password)

            // window.localStorage.setItem('loggedAppUser', JSON.stringify(loginUser))
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