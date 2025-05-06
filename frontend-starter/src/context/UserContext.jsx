import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // For development, create a mock user if none exists
  useEffect(() => {
    if (!loading && !currentUser) {
      // Create a mock user for development
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=2196f3&color=fff'
      };
      
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
  }, [loading, currentUser]);

  // Login function
  const login = (userData) => {
    // In a real app, you would validate credentials with an API
    // For now, just set the user directly
    const user = {
      id: userData.id || 'user-' + Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };
    
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updatedUser = {
      ...currentUser,
      ...updatedData
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 