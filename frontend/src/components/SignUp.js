import { useState, useContext } from "react";
import  signUpService from '../services/signUp'
import { UserContext } from "../providers/UserProvider";


export const SignUp = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')

    const [user, setUser] = useContext(UserContext)

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
            const user = await signUpService.signUp({
                username, password, name
            })


            window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
            setUser(user)
            setName('')
            setUsername('')
            setPassword('')
            setConfirmPassword('')
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
                        Click here
                    </button>
                </div>
            </div>
        </div>
    )
}
