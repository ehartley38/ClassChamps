import React, { useState, createContext, useEffect } from "react";
import classroomService from '../services/classrooms'

export const UserContext = createContext({ user: null });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState('');

    // Need to clean hook up
    
    useEffect(() => {
        const jwt = window.localStorage.getItem('loggedAppUser')
        if (jwt) {
            const user = JSON.parse(jwt)
            setUser(user)
        }
    },[])
    

    //console.log(`user is ${user.token}`);
    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;