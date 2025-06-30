import io from 'socket.io-client';

let socket = null;
let mockMode = true; // Use mock mode by default

// Mock event handlers
const mockEventHandlers = {};

// Initialize the mockStorage
const mockStorage = {
  communities: [],
  users: {},
  messages: {},
  activeUsers: {},
  directMessages: {}
};

// Setup BroadcastChannel for cross-tab communication
let broadcastChannel;
try {
  broadcastChannel = new BroadcastChannel('community-chat-channel');
  
  // Listen for messages from other instances
  broadcastChannel.onmessage = (event) => {
    const { type, data } = event.data;
    
    console.log('BroadcastChannel received:', type, data);
    
    switch (type) {
      case 'NEW_MESSAGE':
        if (data && mockEventHandlers['receive_message']) {
          mockEventHandlers['receive_message'].forEach(handler => 
            handler(data)
          );
        }
        break;
        
      case 'USER_JOINED':
        if (data && mockEventHandlers['user_joined_community']) {
          mockEventHandlers['user_joined_community'].forEach(handler => 
            handler(data)
          );
        }
        break;
        
      case 'USER_LEFT':
        if (data && mockEventHandlers['user_left_community']) {
          mockEventHandlers['user_left_community'].forEach(handler => 
            handler(data)
          );
        }
        break;
        
      case 'USER_TYPING':
        if (data && mockEventHandlers['user_typing']) {
          mockEventHandlers['user_typing'].forEach(handler => 
            handler(data)
          );
        }
        break;
        
      case 'COMMUNITY_CREATED':
        if (data && mockEventHandlers['new_community']) {
          mockEventHandlers['new_community'].forEach(handler => 
            handler(data)
          );
        }
        break;
        
      case 'UPDATE_STORAGE':
        if (data) {
          Object.assign(mockStorage, data);
          
          // Update communities list
          if (mockEventHandlers['communities_list']) {
            mockEventHandlers['communities_list'].forEach(handler => 
              handler(mockStorage.communities)
            );
          }
          
          // Update active users for each community
          Object.keys(mockStorage.activeUsers).forEach(communityId => {
            if (mockEventHandlers[`active_users_${communityId}`]) {
              mockEventHandlers[`active_users_${communityId}`].forEach(handler => 
                handler(mockStorage.activeUsers[communityId])
              );
            }
          });
          
          // Update messages for each community
          Object.keys(mockStorage.messages).forEach(communityId => {
            if (mockEventHandlers[`community_messages_${communityId}`]) {
              mockEventHandlers[`community_messages_${communityId}`].forEach(handler => 
                handler(mockStorage.messages[communityId])
              );
            }
          });
        }
        break;
        
      case 'DIRECT_MESSAGE':
        if (data && mockEventHandlers['direct_message_received']) {
          mockEventHandlers['direct_message_received'].forEach(handler => 
            handler(data)
          );
        }
        break;
    }
  };
} catch (error) {
  console.error('BroadcastChannel not supported:', error);
  // Fallback to localStorage
}

// Helper function to load mock data from localStorage
const loadMockDataFromStorage = () => {
  try {
    const storedData = localStorage.getItem('mockCommunityData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Update our mockStorage with the data from localStorage
      Object.assign(mockStorage, parsedData);
    } else {
      // Initialize with default data if nothing exists in localStorage
      mockStorage.communities = getMockCommunities();
      saveMockDataToStorage();
    }
  } catch (error) {
    console.error('Error loading mock data from localStorage:', error);
    mockStorage.communities = getMockCommunities();
  }
};

// Helper function to save mock data to localStorage
const saveMockDataToStorage = () => {
  try {
    localStorage.setItem('mockCommunityData', JSON.stringify(mockStorage));
    
    // Broadcast storage update to other instances
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'UPDATE_STORAGE',
        data: mockStorage
      });
    }
  } catch (error) {
    console.error('Error saving mock data to localStorage:', error);
  }
};

// Listen for storage events to sync data across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'mockCommunityData') {
    try {
      const newData = JSON.parse(event.newValue);
      if (newData) {
        Object.assign(mockStorage, newData);
        
        // Notify listeners about updates
        if (mockEventHandlers['receive_message']) {
          const allMessages = [];
          Object.keys(mockStorage.messages).forEach(communityId => {
            mockStorage.messages[communityId].forEach(msg => {
              allMessages.push(msg);
            });
          });
          
          // Sort by timestamp and get the latest one
          if (allMessages.length > 0) {
            const latestMessage = allMessages.sort((a, b) => 
              new Date(b.timestamp) - new Date(a.timestamp)
            )[0];
            
            mockEventHandlers['receive_message'].forEach(handler => 
              handler(latestMessage)
            );
          }
        }
        
        // Update communities list
        if (mockEventHandlers['communities_list']) {
          mockEventHandlers['communities_list'].forEach(handler => 
            handler(mockStorage.communities)
          );
        }
        
        // Update active users
        Object.keys(mockStorage.activeUsers).forEach(communityId => {
          if (mockEventHandlers[`active_users_${communityId}`]) {
            mockEventHandlers[`active_users_${communityId}`].forEach(handler => 
              handler(mockStorage.activeUsers[communityId])
            );
          }
        });
      }
    } catch (error) {
      console.error('Error processing storage event:', error);
    }
  }
});

// Mock socket for development
const createMockSocket = (userId, userName) => {
  console.log("Using mock socket mode for user:", userName, userId);
  
  // Load data from localStorage first
  loadMockDataFromStorage();
  
  // Register the user in the mock storage
  if (userId && userName) {
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
    mockStorage.users[userId] = {
      id: userId,
      name: userName,
      status: 'online',
      avatar: userAvatar,
      lastActive: new Date().toISOString()
    };
    saveMockDataToStorage();
    
    // Broadcast user connected event
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'USER_CONNECTED',
        data: {
          userId,
          userData: mockStorage.users[userId]
        }
      });
    }
  }
  
  return {
    id: 'mock-socket-' + Math.random().toString(36).substring(2, 9),
    connected: true,
    userId: userId,
    userName: userName,
    
    // Register event handlers
    on: (event, handler) => {
      if (!mockEventHandlers[event]) {
        mockEventHandlers[event] = [];
      }
      mockEventHandlers[event].push(handler);
      
      // If registering for community messages, immediately deliver existing messages
      if (event.startsWith('community_messages_')) {
        const communityId = event.split('community_messages_')[1];
        if (mockStorage.messages[communityId]) {
          setTimeout(() => {
            handler(mockStorage.messages[communityId]);
          }, 100);
        }
      }
      
      // If registering for active users, immediately deliver existing users
      if (event.startsWith('active_users_')) {
        const communityId = event.split('active_users_')[1];
        if (mockStorage.activeUsers[communityId]) {
          setTimeout(() => {
            handler(mockStorage.activeUsers[communityId]);
          }, 100);
        }
      }
      
      return this;
    },
    
    // Remove event handlers
    off: (event) => {
      delete mockEventHandlers[event];
      return this;
    },
    
    // Emit events
    emit: (event, data) => {
      console.log(`Mock socket emitting: ${event}`, data);
      
      // Handle mock responses
      setTimeout(() => {
        // Handle different mock events
        switch (event) {
          case 'user_connected':
            if (data && data.userId && data.userData) {
              // Store the user data in our mock storage
              mockStorage.users[data.userId] = {
                ...data.userData,
                status: 'online',
                lastActive: new Date().toISOString()
              };
              
              saveMockDataToStorage();
              
              // Notify all clients about the new user
              if (mockEventHandlers['user_status_change']) {
                mockEventHandlers['user_status_change'].forEach(handler => 
                  handler(mockStorage.users[data.userId])
                );
              }
            }
            break;
            
          case 'get_communities':
            if (mockEventHandlers['communities_list']) {
              mockEventHandlers['communities_list'].forEach(handler => 
                handler(mockStorage.communities)
              );
            }
            break;
            
          case 'get_community_messages':
            if (data && data.communityId) {
              // Initialize messages for this community if not already
              if (!mockStorage.messages[data.communityId]) {
                mockStorage.messages[data.communityId] = getMockMessages().map(msg => ({
                  ...msg,
                  communityId: data.communityId
                }));
                saveMockDataToStorage();
              }
              
              if (mockEventHandlers[`community_messages_${data.communityId}`]) {
                mockEventHandlers[`community_messages_${data.communityId}`].forEach(handler => 
                  handler(mockStorage.messages[data.communityId])
                );
              }
            }
            break;
            
          case 'get_active_users':
            if (data && data.communityId) {
              // Initialize active users for this community if not already
              if (!mockStorage.activeUsers[data.communityId]) {
                mockStorage.activeUsers[data.communityId] = Object.values(mockStorage.users);
                saveMockDataToStorage();
              }
              
              if (mockEventHandlers[`active_users_${data.communityId}`]) {
                mockEventHandlers[`active_users_${data.communityId}`].forEach(handler => 
                  handler(mockStorage.activeUsers[data.communityId])
                );
              }
            }
            break;
            
          case 'send_message':
            if (data) {
              // Store message in the community's messages
              if (!mockStorage.messages[data.communityId]) {
                mockStorage.messages[data.communityId] = [];
              }
              
              // Add an ID if not present and ensure timestamp
              const newMessage = {
                ...data,
                id: data.id || Date.now().toString(),
                timestamp: data.timestamp || new Date().toISOString()
              };
              
              mockStorage.messages[data.communityId].push(newMessage);
              saveMockDataToStorage();
              
              // Broadcast the new message to all instances
              if (broadcastChannel) {
                broadcastChannel.postMessage({
                  type: 'NEW_MESSAGE',
                  data: newMessage
                });
              }
              
              // Notify all listeners about the new message
              if (mockEventHandlers['receive_message']) {
                mockEventHandlers['receive_message'].forEach(handler => 
                  handler(newMessage)
                );
              }
            }
            break;
            
          case 'create_community':
            if (data) {
              // Ensure the community has all required fields
              const newCommunity = {
                ...data,
                id: data.id || Date.now().toString(),
                members: data.members || 1,
                createdAt: data.createdAt || new Date().toISOString()
              };
              
              // Add this community to the list
              mockStorage.communities.push(newCommunity);
              saveMockDataToStorage();
              
              // Broadcast new community to all instances
              if (broadcastChannel) {
                broadcastChannel.postMessage({
                  type: 'COMMUNITY_CREATED',
                  data: newCommunity
                });
              }
              
              if (mockEventHandlers['new_community']) {
                mockEventHandlers['new_community'].forEach(handler => 
                  handler(newCommunity)
                );
              }
            }
            break;
            
          case 'join_community':
            if (data && data.userId && data.communityId) {
              // Update the community to mark this user as joined
              mockStorage.communities = mockStorage.communities.map(community => {
                if (community.id === data.communityId) {
                  return {
                    ...community,
                    members: community.members + 1,
                    isJoined: true
                  };
                }
                return community;
              });
              
              // Make sure the user exists in our storage
              if (!mockStorage.users[data.userId] && data.userInfo) {
                mockStorage.users[data.userId] = {
                  ...data.userInfo,
                  status: 'online',
                  lastActive: new Date().toISOString()
                };
              }
              
              // Add user to active users for this community
              if (!mockStorage.activeUsers[data.communityId]) {
                mockStorage.activeUsers[data.communityId] = [];
              }
              
              // Check if the user is already in active users
              const userExists = mockStorage.activeUsers[data.communityId].some(u => u.id === data.userId);
              
              if (!userExists && mockStorage.users[data.userId]) {
                mockStorage.activeUsers[data.communityId].push({
                  ...mockStorage.users[data.userId],
                  status: 'online'
                });
              }
              
              saveMockDataToStorage();
              
              // Broadcast user joined event
              if (broadcastChannel) {
                broadcastChannel.postMessage({
                  type: 'USER_JOINED',
                  data: {
                    communityId: data.communityId,
                    user: mockStorage.users[data.userId]
                  }
                });
              }
              
              // Notify about user joining the community
              if (mockEventHandlers['user_joined_community']) {
                mockEventHandlers['user_joined_community'].forEach(handler => 
                  handler({
                    communityId: data.communityId,
                    user: mockStorage.users[data.userId]
                  })
                );
              }
              
              // Update community in all clients
              if (mockEventHandlers['community_updated']) {
                const updatedCommunity = mockStorage.communities.find(c => c.id === data.communityId);
                if (updatedCommunity) {
                  mockEventHandlers['community_updated'].forEach(handler => 
                    handler(updatedCommunity)
                  );
                }
              }
            }
            break;
            
          case 'leave_community':
            if (data && data.userId && data.communityId) {
              // Update the community to mark this user as left
              mockStorage.communities = mockStorage.communities.map(community => {
                if (community.id === data.communityId) {
                  return {
                    ...community,
                    members: Math.max(0, community.members - 1),
                    isJoined: false
                  };
                }
                return community;
              });
              
              // Remove user from active users for this community
              if (mockStorage.activeUsers[data.communityId]) {
                mockStorage.activeUsers[data.communityId] = mockStorage.activeUsers[data.communityId]
                  .filter(user => user.id !== data.userId);
              }
              
              saveMockDataToStorage();
              
              // Broadcast user left event
              if (broadcastChannel) {
                broadcastChannel.postMessage({
                  type: 'USER_LEFT',
                  data: {
                    communityId: data.communityId,
                    userId: data.userId
                  }
                });
              }
              
              // Update community in all clients
              if (mockEventHandlers['community_updated']) {
                const updatedCommunity = mockStorage.communities.find(c => c.id === data.communityId);
                if (updatedCommunity) {
                  mockEventHandlers['community_updated'].forEach(handler => 
                    handler(updatedCommunity)
                  );
                }
              }
            }
            break;
            
          case 'typing':
            if (broadcastChannel) {
              broadcastChannel.postMessage({
                type: 'USER_TYPING',
                data
              });
            }
            
            if (mockEventHandlers['user_typing']) {
              mockEventHandlers['user_typing'].forEach(handler => 
                handler(data)
              );
            }
            break;
            
          case 'get_direct_messages':
            if (data && data.conversationId) {
              if (mockEventHandlers[`direct_messages_${data.conversationId}`]) {
                mockEventHandlers[`direct_messages_${data.conversationId}`].forEach(handler => 
                  handler(mockStorage.directMessages[data.conversationId] || [])
                );
              }
            }
            break;
            
          case 'send_direct_message':
            if (data && data.conversationId) {
              // Initialize direct messages for this conversation if not already
              if (!mockStorage.directMessages[data.conversationId]) {
                mockStorage.directMessages[data.conversationId] = [];
              }
              
              // Add message to conversation
              mockStorage.directMessages[data.conversationId].push(data);
              saveMockDataToStorage();
              
              // Broadcast the direct message to all instances
              if (broadcastChannel) {
                broadcastChannel.postMessage({
                  type: 'DIRECT_MESSAGE',
                  data: data
                });
              }
              
              // Notify all listeners about the new direct message
              if (mockEventHandlers['direct_message_received']) {
                mockEventHandlers['direct_message_received'].forEach(handler => 
                  handler(data)
                );
              }
            }
            break;
            
          default:
            console.log(`No mock handler for event: ${event}`);
        }
      }, 300); // Simulate delay
      
      return true;
    },
    
    // Disconnect
    disconnect: () => {
      console.log("Mock socket disconnected");
      // Update user status to offline
      if (userId && mockStorage.users[userId]) {
        mockStorage.users[userId].status = 'offline';
        mockStorage.users[userId].lastActive = new Date().toISOString();
        saveMockDataToStorage();
      }
      
      // Clean up BroadcastChannel
      if (broadcastChannel) {
        try {
          broadcastChannel.close();
        } catch (error) {
          console.error('Error closing BroadcastChannel:', error);
        }
      }
      
      return true;
    }
  };
};

// Initialize and get socket instance
export const getSocket = (userId, userName) => {
  if (!socket) {
    if (mockMode) {
      socket = createMockSocket(userId, userName);
    } else {
      try {
        // Try to connect to real server
        socket = io('http://localhost:3001', {
          query: {
            userId,
            userName
          },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        // Set up connection event handlers
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          // Fall back to mock mode if connection fails
          console.log('Falling back to mock mode');
          socket = createMockSocket(userId, userName);
        });
      } catch (error) {
        console.error('Error creating socket:', error);
        socket = createMockSocket(userId, userName);
      }
    }
  }

  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Toggle mock mode (for testing)
export const toggleMockMode = (useMock = true) => {
  mockMode = useMock;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return mockMode;
};

// Socket event emitters
export const emitUserConnected = (userData) => {
  if (!socket) return false;
  socket.emit('user_connected', userData);
  return true;
};

export const emitJoinCommunity = (userId, communityId) => {
  if (!socket) return false;
  socket.emit('join_community', { userId, communityId });
  return true;
};

export const emitLeaveCommunity = (userId, communityId) => {
  if (!socket) return false;
  socket.emit('leave_community', { userId, communityId });
  return true;
};

export const emitCreateCommunity = (communityData) => {
  if (!socket) return false;
  socket.emit('create_community', communityData);
  return true;
};

export const emitSendMessage = (messageData) => {
  if (!socket) return false;
  socket.emit('send_message', messageData);
  return true;
};

export const emitTyping = (data) => {
  if (!socket) return false;
  socket.emit('typing', data);
  return true;
};

// Mock data helpers
export const getMockCommunities = () => {
  return [
    { 
      id: '1', 
      name: 'General Discussion', 
      members: 15, 
      isJoined: true,
      description: "A place to discuss anything related to campus and courses",
      photo: "https://picsum.photos/seed/community1/200",
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000).toISOString(),
      createdBy: "admin"
    },
    { 
      id: '2', 
      name: 'Course Help', 
      members: 8, 
      isJoined: false,
      description: "Get help with course materials and assignments",
      photo: "https://picsum.photos/seed/community2/200",
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 15 * 1000).toISOString(),
      createdBy: "professor"
    },
    { 
      id: '3', 
      name: 'Placement Prep', 
      members: 12, 
      isJoined: true,
      description: "Discuss interview preparation and share job opportunities",
      photo: "https://picsum.photos/seed/community3/200",
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000).toISOString(),
      createdBy: "placement-officer"
    },
    { 
      id: '4', 
      name: 'Campus Events', 
      members: 5, 
      isJoined: false,
      description: "Updates about upcoming events and activities on campus",
      photo: "https://picsum.photos/seed/community4/200",
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 3 * 1000).toISOString(),
      createdBy: "event-coordinator"
    }
  ];
};

export const getMockMessages = () => {
  return [
    {
      id: '1',
      text: 'Welcome to the community!',
      sender: {
        id: 'admin',
        name: 'System',
        avatar: 'https://ui-avatars.com/api/?name=System&background=2196f3&color=fff'
      },
      timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
      attachments: []
    },
    {
      id: '2',
      text: 'Hi everyone, I\'m new here!',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4caf50&color=fff'
      },
      timestamp: new Date(Date.now() - 60000 * 30).toISOString(),
      attachments: []
    },
    {
      id: '3',
      text: 'Welcome John! How are you doing?',
      sender: {
        id: 'user2',
        name: 'Sarah Smith',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=ff9800&color=fff'
      },
      timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
      attachments: []
    },
    {
      id: '4',
      text: 'Thanks! I\'m excited to be here and learn from everyone.',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4caf50&color=fff'
      },
      timestamp: new Date(Date.now() - 60000 * 10).toISOString(),
      attachments: []
    },
    {
      id: '5',
      text: 'Has anyone started working on the project yet?',
      sender: {
        id: 'user3',
        name: 'Michael Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=9c27b0&color=fff'
      },
      timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
      attachments: []
    }
  ];
};

export const getMockUsers = (currentUserId) => {
  // If we have users in mockStorage, use them instead
  if (mockStorage && Object.keys(mockStorage.users).length > 0) {
    return Object.values(mockStorage.users).map(user => ({
      ...user,
      isCurrentUser: user.id === currentUserId
    }));
  }
  
  // Otherwise, return default mock users
  return [
    {
      id: currentUserId || 'current-user',
      name: 'You',
      status: 'online',
      avatar: 'https://ui-avatars.com/api/?name=You&background=2196f3&color=fff',
      isCurrentUser: true,
      lastActive: new Date().toISOString()
    },
    {
      id: 'user1',
      name: 'John Doe',
      status: 'online',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4caf50&color=fff',
      isCurrentUser: false,
      lastActive: new Date().toISOString()
    },
    {
      id: 'user2',
      name: 'Sarah Smith',
      status: 'online',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=ff9800&color=fff',
      isCurrentUser: false,
      lastActive: new Date().toISOString()
    },
    {
      id: 'user3',
      name: 'Michael Johnson',
      status: 'away',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=9c27b0&color=fff',
      isCurrentUser: false,
      lastActive: new Date(Date.now() - 60000 * 5).toISOString()
    },
    {
      id: 'user4',
      name: 'Emily Brown',
      status: 'offline',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=795548&color=fff',
      isCurrentUser: false,
      lastActive: new Date(Date.now() - 60000 * 30).toISOString()
    }
  ];
};

// Get direct messages between two users
export const getDirectMessages = (fromUserId, toUserId) => {
  if (!socket) return [];
  
  // Create a unique conversation ID - always use the same order of IDs to ensure consistency
  const conversationId = [fromUserId, toUserId].sort().join('-');
  
  // Initialize direct messages for this conversation if not already
  if (!mockStorage.directMessages[conversationId]) {
    mockStorage.directMessages[conversationId] = [];
    saveMockDataToStorage();
  }
  
  socket.emit('get_direct_messages', { fromUserId, toUserId, conversationId });
  return mockStorage.directMessages[conversationId];
};

// Send a direct message to another user
export const sendDirectMessage = (fromUserId, toUserId, message) => {
  if (!socket) return false;
  
  // Create a unique conversation ID
  const conversationId = [fromUserId, toUserId].sort().join('-');
  
  // Create message object
  const messageData = {
    id: Date.now().toString(),
    text: message.text,
    sender: mockStorage.users[fromUserId] || { id: fromUserId },
    recipient: mockStorage.users[toUserId] || { id: toUserId },
    timestamp: new Date().toISOString(),
    conversationId,
    attachments: message.attachments || [],
    isRead: false
  };
  
  socket.emit('send_direct_message', messageData);
  return true;
};

// Search for users by username
export const searchUsersByUsername = (username) => {
  if (!socket) return [];
  
  return new Promise((resolve) => {
    // In a real app, this would send a socket emit to search the server database
    // For mock mode, we'll filter the existing users
    setTimeout(() => {
      const allUsers = Object.values(mockStorage.users);
      
      if (!username || username.trim() === '') {
        resolve(allUsers);
        return;
      }
      
      const matchingUsers = allUsers.filter(user => 
        user.name && user.name.toLowerCase().includes(username.toLowerCase())
      );
      
      resolve(matchingUsers);
    }, 300);
  });
};

// Get user by exact username - useful for direct messaging
export const getUserByUsername = (username) => {
  if (!socket) return null;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const allUsers = Object.values(mockStorage.users);
      const user = allUsers.find(user => 
        user.name && user.name.toLowerCase() === username.toLowerCase()
      );
      
      resolve(user || null);
    }, 300);
  });
};

// Add or update a user in the database
export const addOrUpdateUser = (userData) => {
  if (!socket) return false;
  
  // In a real app, this would update the server database
  // For mock mode, we'll update our local mockStorage
  if (userData && userData.id) {
    mockStorage.users[userData.id] = {
      ...mockStorage.users[userData.id],
      ...userData,
      lastActive: new Date().toISOString()
    };
    saveMockDataToStorage();
    return true;
  }
  
  return false;
};

// Add a "createGroupChat" function to start a group conversation
export const createGroupChat = (name, members, creatorId) => {
  if (!socket) return null;

  const groupId = 'group-' + Date.now();
  
  const groupData = {
    id: groupId,
    name: name,
    type: 'group',
    members: members.map(m => m.id),
    createdBy: creatorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  };
  
  // In a real app, this would be a socket emit to create the group on the server
  // For mock mode, we'll add it to our communities
  mockStorage.communities.push({
    ...groupData,
    isJoined: true,
    description: `Group chat: ${name}`,
    photo: groupData.avatar,
    members: members.length + 1 // Include creator
  });
  
  saveMockDataToStorage();
  
  // Broadcast to all clients
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      type: 'GROUP_CREATED',
      data: groupData
    });
  }
  
  return groupData;
}; 