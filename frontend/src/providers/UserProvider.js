import React, { useState, createContext, useEffect } from "react";
import classroomService from '../services/classrooms'

export const UserContext = createContext({ user: null });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState('');

    // Need to clean hook up
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            classroomService.setToken(user.token)
        }
    }, [])

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;