import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// For development purposes, setting this to true will bypass authentication
const BYPASS_AUTH = true;

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      // For development purposes, bypass authentication check
      if (BYPASS_AUTH) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
