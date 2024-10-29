import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, userRole, allowedRoles }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
