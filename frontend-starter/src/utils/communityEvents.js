// Utility file to handle real-time events for community chat using a simple event system
import { updateUserStatus } from './communityUtils';

// Event bus for real-time events
class CommunityEventBus {
  constructor() {
    this.subscribers = {
      // Initialize all event types with empty arrays to prevent "No subscribers" warnings
      'user-online': [],
      'user-offline': [],
      'message-received': [],
      'community-joined': [],
      'community-left': [],
      'community-created': [],
      'user-typing': [],
      'message-read': []
    };
    this.userStatus = new Map(); // Track user online status
    this.typingUsers = new Map(); // Track typing users
  }

  // Subscribe to an event
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    
    this.subscribers[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  // Publish an event
  publish(event, data) {
    if (!this.subscribers[event] || this.subscribers[event].length === 0) {
      console.log(`No subscribers for event: ${event}`);
      return;
    }
    
    console.log(`Publishing event ${event} with data:`, data);
    
    this.subscribers[event].forEach(callback => {
      try {
        setTimeout(() => callback(data), 0);
      } catch (error) {
        console.error(`Error executing subscriber callback for event ${event}:`, error);
      }
    });
  }
  
  // Track user typing status
  updateTypingStatus(userId, chatId, isTyping) {
    const key = `${userId}-${chatId}`;
    
    if (isTyping) {
      this.typingUsers.set(key, Date.now());
      this.publish(EVENTS.USER_TYPING, { userId, chatId, isTyping });
    } else if (this.typingUsers.has(key)) {
      this.typingUsers.delete(key);
      this.publish(EVENTS.USER_TYPING, { userId, chatId, isTyping: false });
    }
  }
}

// Create a singleton instance
const eventBus = new CommunityEventBus();

// Event types
export const EVENTS = {
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  MESSAGE_RECEIVED: 'message-received',
  COMMUNITY_JOINED: 'community-joined',
  COMMUNITY_LEFT: 'community-left',
  COMMUNITY_CREATED: 'community-created',
  USER_TYPING: 'user-typing',
  MESSAGE_READ: 'message-read'
};

// User status management
export const handleUserOnline = (userId) => {
  console.log('User online:', userId);
  updateUserStatus(userId, true);
  eventBus.publish(EVENTS.USER_ONLINE, { userId });
};

export const handleUserOffline = (userId) => {
  console.log('User offline:', userId);
  updateUserStatus(userId, false);
  eventBus.publish(EVENTS.USER_OFFLINE, { userId });
};

// Set up user presence (called when the application starts)
export const setupUserPresence = (userId) => {
  if (!userId) {
    console.warn('setupUserPresence called with empty userId');
    return null;
  }
  
  console.log('Setting up presence for user:', userId);
  
  // Mark user as online
  handleUserOnline(userId);
  
  // Set up "unload" event to mark user as offline when they leave
  const handleBeforeUnload = () => {
    handleUserOffline(userId);
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Set up periodic heartbeat to maintain online status
  const heartbeatInterval = setInterval(() => {
    handleUserOnline(userId);
  }, 30000); // Every 30 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(heartbeatInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    handleUserOffline(userId);
  };
};

// Track typing status
export const updateUserTyping = (userId, chatId, isTyping) => {
  eventBus.updateTypingStatus(userId, chatId, isTyping);
};

// Subscribe to real-time events
export const onUserOnline = (callback) => eventBus.subscribe(EVENTS.USER_ONLINE, callback);
export const onUserOffline = (callback) => eventBus.subscribe(EVENTS.USER_OFFLINE, callback);
export const onMessageReceived = (callback) => eventBus.subscribe(EVENTS.MESSAGE_RECEIVED, callback);
export const onCommunityJoined = (callback) => eventBus.subscribe(EVENTS.COMMUNITY_JOINED, callback);
export const onCommunityLeft = (callback) => eventBus.subscribe(EVENTS.COMMUNITY_LEFT, callback);
export const onCommunityCreated = (callback) => eventBus.subscribe(EVENTS.COMMUNITY_CREATED, callback);
export const onUserTyping = (callback) => eventBus.subscribe(EVENTS.USER_TYPING, callback);
export const onMessageRead = (callback) => eventBus.subscribe(EVENTS.MESSAGE_READ, callback);

// Notify about a new message
export const notifyNewMessage = (message) => {
  try {
    if (!message) {
      console.error('notifyNewMessage: No message provided');
      return false;
    }
    
    // Validate message
    if (!message.sender) {
      console.error('notifyNewMessage: Message missing sender');
      return false;
    }
    
    // Add a unique ID if not present
    if (!message.id) {
      message.id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Add timestamp if not present
    if (!message.createdAt) {
      message.createdAt = new Date().toISOString();
    }
    
    // For community messages
    if (message.communityId) {
      // Publish both to MESSAGE_RECEIVED and the specific community event
      eventBus.publish(EVENTS.MESSAGE_RECEIVED, {
        message: {
          ...message,
          type: 'community'
        }
      });
      
      // Also publish to a community-specific event for better targeting
      eventBus.publish(`community-message-${message.communityId}`, {
        message
      });
      
      return true;
    } 
    // For direct messages
    else if (message.recipientId) {
      // Publish to MESSAGE_RECEIVED
      eventBus.publish(EVENTS.MESSAGE_RECEIVED, {
        message: {
          ...message,
          type: 'direct'
        }
      });
      
      // Also publish to a user-specific event for better targeting
      eventBus.publish(`direct-message-${message.recipientId}`, {
        message
      });
      
      return true;
    } else {
      console.error('notifyNewMessage: Message is neither community nor direct (missing ids)');
      return false;
    }
  } catch (error) {
    console.error('Error notifying about new message:', error);
    return false;
  }
};

// Mark message as read
export const markMessageAsRead = (messageId, userId) => {
  eventBus.publish(EVENTS.MESSAGE_READ, { messageId, userId });
};

// Notify community join
export const notifyCommunityJoined = (userId, communityId) => {
  if (!userId || !communityId) {
    console.error('notifyCommunityJoined: Missing userId or communityId');
    return;
  }
  console.log(`User ${userId} joined community ${communityId}`);
  eventBus.publish(EVENTS.COMMUNITY_JOINED, { userId, communityId });
};

// Notify community leave
export const notifyCommunityLeft = (userId, communityId) => {
  eventBus.publish(EVENTS.COMMUNITY_LEFT, { userId, communityId });
};

// Notify community created
export const notifyCommunityCreated = (community) => {
  eventBus.publish(EVENTS.COMMUNITY_CREATED, { community });
};

export default eventBus;

// communityEvents.js - Socket.io event handlers for community chat

// Initialize socket connection
export const initializeSocket = (socket, userId, userName) => {
  if (!socket) return;

  // Emit user connection event
  socket.emit('user_connected', {
    userId,
    userName,
    timestamp: new Date().toISOString()
  });

  // Set up ping interval to keep connection alive
  const pingInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit('ping');
    } else {
      clearInterval(pingInterval);
    }
  }, 30000); // 30 seconds

  return () => {
    clearInterval(pingInterval);
    socket.disconnect();
  };
};

// Join a community
export const joinCommunity = (socket, userId, communityId) => {
  if (!socket || !userId || !communityId) return false;
  
  socket.emit('join_community', { userId, communityId });
  return true;
};

// Leave a community
export const leaveCommunity = (socket, userId, communityId) => {
  if (!socket || !userId || !communityId) return false;
  
  socket.emit('leave_community', { userId, communityId });
  return true;
};

// Send a message to a community
export const sendMessage = (socket, messageData) => {
  if (!socket || !messageData) return false;
  
  socket.emit('send_message', messageData);
  return true;
};

// Send typing notification
export const sendTypingNotification = (socket, userId, userName, communityId) => {
  if (!socket || !userId || !communityId) return false;
  
  socket.emit('typing', { userId, userName, communityId });
  return true;
};

// Create a new community
export const createCommunity = (socket, communityData) => {
  if (!socket || !communityData) return false;
  
  socket.emit('create_community', communityData);
  return true;
};

// Update a community
export const updateCommunity = (socket, communityId, updates) => {
  if (!socket || !communityId || !updates) return false;
  
  socket.emit('update_community', { communityId, updates });
  return true;
};

// Delete a community
export const deleteCommunity = (socket, communityId, userId) => {
  if (!socket || !communityId || !userId) return false;
  
  socket.emit('delete_community', { communityId, userId });
  return true;
};

// Get active users in a community
export const getActiveUsers = (socket, communityId) => {
  if (!socket || !communityId) return false;
  
  socket.emit('get_active_users', { communityId });
  return true;
};

// Handle file uploads
export const uploadAttachment = async (file) => {
  // In a real application, this would upload to a server
  // For now, we'll just mock the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      });
    }, 1000);
  });
};

// Set up event listeners
export const setupEventListeners = (socket, setMessages, setUsers, setCommunities, setTypingUsers) => {
  if (!socket) return;

  // Message received event
  socket.on('receive_message', (message) => {
    if (setMessages) {
      setMessages(prev => [...prev, message]);
    }
  });

  // User status change event
  socket.on('user_status_change', (userData) => {
    if (setUsers) {
      setUsers(prev => {
        const userExists = prev.some(user => user.id === userData.id);
        
        if (userExists) {
          return prev.map(user => 
            user.id === userData.id ? { ...user, ...userData } : user
          );
        } else {
          return [...prev, userData];
        }
      });
    }
  });

  // User disconnected event
  socket.on('user_disconnected', (userId) => {
    if (setUsers) {
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'offline', lastActive: new Date().toISOString() } 
            : user
        )
      );
    }
  });

  // Community updated event
  socket.on('community_updated', (updatedCommunity) => {
    if (setCommunities) {
      setCommunities(prev => 
        prev.map(comm => comm.id === updatedCommunity.id ? updatedCommunity : comm)
      );
    }
  });

  // New community event
  socket.on('new_community', (newCommunity) => {
    if (setCommunities) {
      setCommunities(prev => [...prev, newCommunity]);
    }
  });

  // Community deleted event
  socket.on('community_deleted', (communityId) => {
    if (setCommunities) {
      setCommunities(prev => prev.filter(comm => comm.id !== communityId));
    }
  });

  // User typing event
  socket.on('user_typing', ({ userId, userName, communityId }) => {
    if (setTypingUsers) {
      setTypingUsers(prev => {
        // Add user to typing users if not already there
        if (!prev.find(u => u.id === userId)) {
          return [...prev, { id: userId, name: userName, communityId }];
        }
        return prev;
      });
      
      // Remove user from typing after 3 seconds
      setTimeout(() => {
        if (setTypingUsers) {
          setTypingUsers(prev => prev.filter(u => u.id !== userId));
        }
      }, 3000);
    }
  });

  return () => {
    socket.off('receive_message');
    socket.off('user_status_change');
    socket.off('user_disconnected');
    socket.off('community_updated');
    socket.off('new_community');
    socket.off('community_deleted');
    socket.off('user_typing');
  };
}; 