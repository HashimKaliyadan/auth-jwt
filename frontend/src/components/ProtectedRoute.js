import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access');

    // If there is no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, allow them to view the component (e.g., Profile)
    return children;
};

export default ProtectedRoute;
