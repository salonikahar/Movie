import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
