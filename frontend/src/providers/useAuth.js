import React, { useState, createContext, useEffect, useMemo, useContext } from "react";
import usersService from '../services/users'
import loginService from '../services/login'


const AuthContext = createContext({
    user: undefined,
    jwt: undefined,
    login: (username, password) => { },
    signUp: (username, password, name) => { },
    signOut: () => { },
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [jwt, setJwt] = useState(undefined)


    // Fetches the user details whenever the jwt changes
    useEffect(() => {
        console.log('auth');
        const fetchUser = async () => {
            try {
                const fetchedJwt = window.localStorage.getItem('loggedAppUser')
                if (jwt) {
                    const fetchedUser = await usersService.getUserDetails(jwt)
                    setUser(fetchedUser)
                } else if (fetchedJwt && jwt === undefined) {
                    setJwt(JSON.parse(fetchedJwt))
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchUser()

    }, [jwt])

    const login = async (username, password) => {
        try {
            const generatedJwt = await loginService.login({ username, password })
            window.localStorage.setItem('loggedAppUser', JSON.stringify(generatedJwt))

            // GeneratedJwt returns a Json Object, hence why it is set to the jwt directly without any parsing
            setJwt(generatedJwt)
        } catch (err) {
            console.log(err);
        }
    }

    const signUp = async (username, password, name) => {
        try {
            const generatedJwt = await usersService.signUp({
                username, password, name
            })
        } catch (err) {
            console.log(err);
        }
    }


    const signOut = () => {
        console.log('signout');
        window.localStorage.removeItem('loggedAppUser')
        setJwt(undefined)
        setUser(undefined)
    }

    /*
    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            login,
            signUp,
            signOut,
            jwt
        }),
        [user, loading, error, jwt]
    );
    */

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signUp,
            signOut,
            jwt
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}