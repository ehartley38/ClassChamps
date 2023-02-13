import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext({ user: null });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState('');

    // Need to clean hook up
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            //blogService.setToken(user.token)
        }
    }, [])

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;