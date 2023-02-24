import React, { useState, createContext, useEffect, useMemo, useContext } from "react";
import usersService from '../services/users'
import loginService from '../services/login'


const AuthContext = createContext({
    user: undefined,
    loading: false,
    error: undefined,
    jwt: undefined,
    login: (username, password) => { },
    signUp: (username, password, name) => { },
    signOut: () => { },
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [jwt, setJwt] = useState(undefined)


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedJwt = window.localStorage.getItem('loggedAppUser')
                if (fetchedJwt) {
                    const fetchedUser = await usersService.getUserDetails(JSON.parse(fetchedJwt))
                    setJwt(JSON.parse(fetchedJwt))
                    setUser(fetchedUser)
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoadingInitial(false)
            }

        }
        fetchUser()

    }, [])

    const login = async (username, password) => {
        setLoading(true)

        try {
            const generatedJwt = await loginService.login({ username, password })
            window.localStorage.setItem('loggedAppUser', JSON.stringify(generatedJwt))
            setJwt(JSON.stringify(generatedJwt))
            const fetchedUser = await usersService.getUserDetails(generatedJwt);
            setUser(fetchedUser);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }

    }

    const signUp = async (username, password, name) => {
        setLoading(true)

        try {
            const generatedJwt = await usersService.signUp({
                username, password, name
            })
            window.localStorage.setItem('loggedAppUser', JSON.stringify(generatedJwt))
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }


    }

    const signOut = () => {
        window.localStorage.removeItem('loggedAppUser')
        setJwt(undefined)
        setUser(undefined)
    }

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

    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}