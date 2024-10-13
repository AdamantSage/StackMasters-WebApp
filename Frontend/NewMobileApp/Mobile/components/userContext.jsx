// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context
const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook to use the User Context
export const useUser = () => {
    return useContext(UserContext);
};
