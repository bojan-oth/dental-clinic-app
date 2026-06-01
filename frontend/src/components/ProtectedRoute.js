import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        Access Denied. You do not have the required permissions.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;