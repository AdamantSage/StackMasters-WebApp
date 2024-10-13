import React, { createContext, useContext, useState } from 'react';

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
    const [assignmentId, setAssignmentId] = useState(null);

    return (
        <AssignmentContext.Provider value={{ assignmentId, setAssignmentId }}>
            {children}
        </AssignmentContext.Provider>
    );
};

export const useAssignmentContext = () => {
    const context = useContext(AssignmentContext);
    if (!context) {
        throw new Error('useAssignmentContext must be used within an AssignmentProvider');
    }
    return context;
};

