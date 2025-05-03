import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// Hardcoded socket URL - ensure your backend is running on this port
const SOCKET_URL = 'http://localhost:5000';

// Development mode flag to bypass socket connection issues
const BYPASS_SOCKET = true; // Set to true to prevent socket connection attempts

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  
  useEffect(() => {
    let socketInstance;
    let reconnectTimer;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3; // Reduced from 5 to fail faster
    
    // Skip socket connection in bypass mode
    if (BYPASS_SOCKET) {
      // Don't log anything - silent bypass
      return;
    }

    const connectSocket = () => {
      try {
        // Clear any previous error state
        setConnectionError(false);
        
        // Create socket connection with error handling
        socketInstance = io(SOCKET_URL, {
          reconnectionAttempts: 3,
          timeout: 5000, // Reduced timeout
          transports: ['websocket', 'polling']
        });
        
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          setConnected(true);
          reconnectAttempts = 0;
          
          // Log in the current user if available
          try {
            const userString = localStorage.getItem('user');
            if (userString) {
              const user = JSON.parse(userString);
              if (user && user._id) {
                socketInstance.emit('login', user._id);
              }
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        });
        
        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });
        
        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnected(false);
          setConnectionError(true);
          
          // Try to reconnect a limited number of times
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts} in 5 seconds...`);
            reconnectTimer = setTimeout(connectSocket, 5000);
          } else {
            console.log('Max reconnection attempts reached. Running in offline mode.');
          }
        });
        
        // Track user status changes
        socketInstance.on('userStatusChange', ({ userId, status }) => {
          setOnlineUsers(prev => ({
            ...prev,
            [userId]: status === 'online'
          }));
        });
        
        setSocket(socketInstance);
      } catch (error) {
        console.error('Error initializing socket:', error);
        setConnectionError(true);
      }
    };
    
    // Initialize connection
    connectSocket();
    
    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, []);
  
  // Create mock implementations for socket methods when in bypass mode
  const joinCommunity = (communityId) => {
    if (socket && connected) {
      socket.emit('joinCommunity', communityId);
    }
    // In bypass mode, do nothing but don't error
  };
  
  const leaveCommunity = (communityId) => {
    if (socket && connected) {
      socket.emit('leaveCommunity', communityId);
    }
    // In bypass mode, do nothing but don't error
  };
  
  const sendCommunityMessage = (message) => {
    if (socket && connected) {
      socket.emit('sendCommunityMessage', message);
    }
    // In bypass mode, do nothing but don't error
  };
  
  const sendDirectMessage = (message) => {
    if (socket && connected) {
      socket.emit('sendDirectMessage', message);
    }
    // In bypass mode, do nothing but don't error
  };
  
  const sendTypingIndicator = (data) => {
    if (socket && connected) {
      socket.emit('typing', data);
    }
    // In bypass mode, do nothing but don't error
  };
  
  const logout = () => {
    if (socket && connected) {
      socket.emit('logout');
    }
    // In bypass mode, do nothing but don't error
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