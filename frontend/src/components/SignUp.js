import { useState, useContext } from "react";
import  usersService from '../services/users'
import { UserContext } from "../providers/UserProvider";
import { NavLink, useNavigate } from "react-router-dom";


export const SignUp = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')

    const [user, setUser] = useContext(UserContext)

    let navigate = useNavigate()

    const validatePassword = () => {
        let isValid = true
        if (password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                isValid = false
            }
        }
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePassword()) {
            console.log('Error - Username and password must match');
            return;
        }

        try {
            const user = await usersService.signUp({
                username, password, name
            })

            window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
            setName('')
            setUsername('')
            setPassword('')
            setConfirmPassword('')

            navigate('/login')
        } catch (err) {
            console.log(err);
        }
    }

    const handleTestButton = (e) => {
        e.preventDefault()
        console.log('Test button');
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2> Sign up here</h2>
                    Name
                    <input
                        id="name"
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                    <br />
                    Username
                    <input
                        id="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <br />
                    Password
                    <input
                        id="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <br />
                    Confirm Password
                    <input
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={({ target }) => setConfirmPassword(target.value)}
                    />
                    <button type="submit">Sign up</button>
                </form>
                <button onClick={handleTestButton}>Test</button>
                <div>
                    Already have an account?
                    <button>
                        <NavLink to='/login'>Click here</NavLink>
                    </button>
                </div>
            </div>
        </div>
    )
}
