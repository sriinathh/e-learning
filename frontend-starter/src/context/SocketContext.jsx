import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSocket, disconnectSocket, toggleMockMode } from '../utils/socketService';
import { getMockUser } from '../utils/mockUser';

const SocketContext = createContext();

// Set to false to try real connection, true to force mock mode
const FORCE_MOCK_MODE = true;

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  
  // Initialize socket connection
  useEffect(() => {
    // Force mock mode if needed
    if (FORCE_MOCK_MODE) {
      toggleMockMode(true);
    }
    
    // Get current user
    const user = getMockUser();
    
    if (user && !socket) {
      try {
        // Initialize socket with user info
        const socketInstance = getSocket(user.id, user.name || user.username);
        setSocket(socketInstance);
        setConnected(true);
        
        // Listen for online users updates
        socketInstance.on('users_status', (usersData) => {
          const formattedUsers = {};
          usersData.forEach(user => {
            formattedUsers[user.id] = user.status === 'online';
          });
          setOnlineUsers(formattedUsers);
        });

        // Emit a user_connected event to register this user
        socketInstance.emit('user_connected', {
          userId: user.id,
          userData: {
            id: user.id,
            name: user.name || user.username,
            avatar: user.avatar,
            email: user.email,
            status: 'online'
          }
        });
        
      } catch (error) {
        console.error('Socket initialization error:', error);
        setConnectionError(true);
      }
    }
    
    // Cleanup function
    return () => {
      // Only disconnect when component unmounts
      // disconnectSocket();
    };
  }, []);
  
  // Socket methods
  const joinCommunity = (communityId) => {
    if (socket) {
      const user = getMockUser();
      if (user) {
        socket.emit('join_community', { 
          userId: user.id, 
          communityId,
          userInfo: {
            id: user.id,
            name: user.name || user.username,
            avatar: user.avatar,
            email: user.email
          }
        });
        return true;
      }
    }
    return false;
  };
  
  const leaveCommunity = (communityId) => {
    if (socket) {
      const user = getMockUser();
      socket.emit('leave_community', { userId: user?.id, communityId });
      return true;
    }
    return false;
  };
  
  const sendCommunityMessage = (message) => {
    if (socket) {
      socket.emit('send_message', message);
      return true;
    }
    return false;
  };
  
  const sendDirectMessage = (message) => {
    if (socket) {
      socket.emit('send_direct_message', message);
      return true;
    }
    return false;
  };
  
  const sendTypingIndicator = (data) => {
    if (socket) {
      socket.emit('typing', data);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    if (socket) {
      const user = getMockUser();
      socket.emit('logout', { userId: user?.id });
      return true;
    }
    return false;
  };
  
  const value = {
    socket,
    connected,
    connectionError,
    onlineUsers,
    joinCommunity,
    leaveCommunity,
    sendCommunityMessage,
    sendDirectMessage,
    sendTypingIndicator,
    logout
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 