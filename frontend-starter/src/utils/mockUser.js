// Create a mock user for testing purposes
import { disconnectSocket } from './socketService';

export const setupMockUser = () => {
  // Check if user already exists in localStorage
  const existingUser = localStorage.getItem('user');
  
  if (!existingUser) {
    // Create a random user ID
    const userId = 'user-' + Math.random().toString(36).substring(2, 9);
    
    // Create a mock user object
    const mockUser = {
      id: userId,
      name: 'Test User',
      email: 'testuser@example.com',
      username: 'testuser',
      avatar: `https://ui-avatars.com/api/?name=Test+User&background=2196f3&color=fff`,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    
    // Store the mock user in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    console.log('Created mock user:', mockUser);
    return mockUser;
  } else {
    return JSON.parse(existingUser);
  }
};

// Use this to update user data if needed
export const updateMockUser = (userData) => {
  // Disconnect any existing socket
  disconnectSocket();
  
  const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...existingUser, ...userData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};

// Get the current user from localStorage
export const getMockUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper to create a different user for testing
export const createTestUser = (name) => {
  // Disconnect any existing socket
  disconnectSocket();
  
  const userId = 'user-' + Math.random().toString(36).substring(2, 9);
  const newUser = {
    id: userId,
    name: name || 'Test User ' + userId.substring(5),
    email: `test${userId.substring(5)}@example.com`,
    username: `testuser${userId.substring(5)}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Test User')}&background=random`,
    role: 'student',
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('user', JSON.stringify(newUser));
  console.log('Created test user:', newUser);
  
  return newUser;
}; 