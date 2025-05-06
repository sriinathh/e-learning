// Utility functions for community features

// Get the current user from localStorage
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        _id: user._id || `user-${Date.now()}`,
        username: user.username || user.name,
        name: user.name || user.username,
        email: user.email || 'user@example.com',
        isOnline: true,
        profilePic: user.profilePic || user.profilePicture || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=random`,
        isReal: true
      };
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }
  return null;
};

// Add a user to community users in localStorage
export const addUserToCommunity = (user) => {
  try {
    const userToAdd = {
      _id: user._id,
      username: user.username || user.name,
      name: user.name || user.username,
      email: user.email || 'user@example.com',
      isOnline: true,
      profilePic: user.profilePic || user.profilePicture || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=random`,
      isReal: user.isReal === false ? false : true,
      joinedAt: new Date().toISOString()
    };
    
    // Get existing community users
    let communityUsers = [];
    const storedUsers = localStorage.getItem('communityUsers');
    if (storedUsers) {
      communityUsers = JSON.parse(storedUsers);
    }
    
    // Check if user already exists
    const userExists = communityUsers.some(existingUser => existingUser._id === userToAdd._id);
    
    if (!userExists) {
      // Add new user
      communityUsers.push(userToAdd);
      localStorage.setItem('communityUsers', JSON.stringify(communityUsers));
    }
    
    return communityUsers;
  } catch (error) {
    console.error('Error adding user to community:', error);
    return [];
  }
};

// Get all community users
export const getCommunityUsers = () => {
  try {
    const storedUsers = localStorage.getItem('communityUsers');
    
    // If we have stored users, return them (only real ones)
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      // Only return users that are explicitly marked as real with valid data
      const realUsers = users.filter(user => 
        user.isReal === true && 
        user.name && 
        user.email && 
        user._id
      );
      console.log('Strictly filtered real users:', realUsers);
      return realUsers;
    }
    
    // If no community users exist but we have a current user, initialize with them
    const currentUser = getCurrentUser();
    if (currentUser) {
      const initialUsers = [currentUser];
      localStorage.setItem('communityUsers', JSON.stringify(initialUsers));
      return initialUsers;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting community users:', error);
    return [];
  }
};

// Remove a user from community
export const removeUserFromCommunity = (userId) => {
  try {
    const storedUsers = localStorage.getItem('communityUsers');
    if (storedUsers) {
      const communityUsers = JSON.parse(storedUsers);
      const updatedUsers = communityUsers.filter(user => user._id !== userId);
      localStorage.setItem('communityUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    }
  } catch (error) {
    console.error('Error removing user from community:', error);
  }
  return [];
};

// Update a user's online status
export const updateUserStatus = (userId, isOnline) => {
  try {
    const storedUsers = localStorage.getItem('communityUsers');
    if (storedUsers) {
      const communityUsers = JSON.parse(storedUsers);
      const updatedUsers = communityUsers.map(user => 
        user._id === userId ? { ...user, isOnline } : user
      );
      localStorage.setItem('communityUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
  return [];
};

// Get all communities
export const getCommunities = () => {
  try {
    const storedCommunities = localStorage.getItem('communities');
    if (storedCommunities) {
      return JSON.parse(storedCommunities);
    }
    return [];
  } catch (error) {
    console.error('Error getting communities:', error);
    return [];
  }
};

// Create a new community
export const createCommunity = (community) => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to create a community');
    }

    // Generate unique ID
    const newCommunity = {
      ...community,
      id: `community-${Date.now()}`,
      members: [currentUser._id],
      createdAt: new Date().toISOString(),
      createdBy: currentUser._id
    };

    // Get existing communities
    const communities = getCommunities();
    communities.push(newCommunity);
    
    // Save updated communities
    localStorage.setItem('communities', JSON.stringify(communities));
    
    return newCommunity;
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
};

// Join a community
export const joinCommunity = (communityId) => {
  try {
    if (!communityId) {
      throw new Error('Community ID is required');
    }
    
    console.log(`Attempting to join community: ${communityId}`);
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user is logged in');
    }
    
    // Get communities
    const storedCommunities = localStorage.getItem('communities');
    if (!storedCommunities) {
      throw new Error('No communities found');
    }
    
    let communities = [];
    try {
      communities = JSON.parse(storedCommunities);
    } catch (parseError) {
      console.error('Error parsing communities:', parseError);
      throw new Error('Error parsing communities data');
    }
    
    // Find the community
    const communityIndex = communities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }
    
    // Initialize members array if it doesn't exist
    if (!communities[communityIndex].members) {
      communities[communityIndex].members = [];
    }
    
    // Check if user is already a member
    const isMember = communities[communityIndex].members.includes(currentUser._id);
    if (isMember) {
      console.log(`User ${currentUser._id} is already a member of community ${communityId}`);
      return communities[communityIndex];
    }
    
    // Add user to community members
    communities[communityIndex].members.push(currentUser._id);
    console.log(`Added user ${currentUser._id} to community ${communityId}`);
    
    // Save updated communities
    localStorage.setItem('communities', JSON.stringify(communities));
    
    // Return the updated community
    console.log('Successfully joined community:', communities[communityIndex]);
    return communities[communityIndex];
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
};

// Leave a community
export const leaveCommunity = (communityId) => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to leave a community');
    }

    // Get communities
    const communities = getCommunities();
    const communityIndex = communities.findIndex(c => c.id === communityId);
    
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }
    
    // Remove user from members
    communities[communityIndex].members = communities[communityIndex].members.filter(
      memberId => memberId !== currentUser._id
    );
    
    // Save updated communities
    localStorage.setItem('communities', JSON.stringify(communities));
    
    return communities[communityIndex];
  } catch (error) {
    console.error('Error leaving community:', error);
    throw error;
  }
};

// Get communities the current user is a member of
export const getUserCommunities = () => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Get all communities and filter for those the user is a member of
    const communities = getCommunities();
    return communities.filter(community => 
      community.members.includes(currentUser._id)
    );
  } catch (error) {
    console.error('Error getting user communities:', error);
    return [];
  }
};

// Generate direct message ID between two users
export const getDirectMessageId = (user1Id, user2Id) => {
  // Sort IDs to ensure consistent ID regardless of who initiates
  const sortedIds = [user1Id, user2Id].sort();
  return `dm-${sortedIds[0]}-${sortedIds[1]}`;
};

// Store a direct message
export const storeDirectMessage = (senderId, recipientId, message) => {
  try {
    const dmId = getDirectMessageId(senderId, recipientId);
    let messages = [];
    
    // Get existing messages
    const storedMessages = localStorage.getItem(`dm-${dmId}`);
    if (storedMessages) {
      messages = JSON.parse(storedMessages);
    }
    
    // Add new message
    messages.push({
      id: `${dmId}-${Date.now()}`,
      content: message.content,
      sender: message.sender,
      senderName: message.senderName,
      senderPic: message.senderPic,
      attachment: message.attachment || null,
      createdAt: message.createdAt || new Date().toISOString()
    });
    
    // Store updated messages
    localStorage.setItem(`dm-${dmId}`, JSON.stringify(messages));
    
    return messages;
  } catch (error) {
    console.error('Error storing direct message:', error);
    return [];
  }
};

// Get direct messages between two users
export const getDirectMessages = (user1Id, user2Id) => {
  try {
    const dmId = getDirectMessageId(user1Id, user2Id);
    const storedMessages = localStorage.getItem(`dm-${dmId}`);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
  } catch (error) {
    console.error('Error getting direct messages:', error);
  }
  return [];
};

// Store community messages
export const storeCommunityMessage = (communityId, message) => {
  try {
    if (!communityId) {
      throw new Error('Community ID is required');
    }
    
    if (!message) {
      throw new Error('Message object is required');
    }

    console.log(`Storing message in community ${communityId}:`, message);
    
    const key = `community-messages-${communityId}`;
    let messages = [];
    
    // Get existing messages
    const storedMessages = localStorage.getItem(key);
    if (storedMessages) {
      try {
        messages = JSON.parse(storedMessages);
        if (!Array.isArray(messages)) {
          console.warn('Messages in localStorage is not an array, resetting');
          messages = [];
        }
      } catch (parseError) {
        console.error('Error parsing stored messages:', parseError);
        messages = [];
      }
    }
    
    // Add new message with ID
    const newMessage = {
      id: `${communityId}-msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: message.content,
      sender: message.sender,
      senderName: message.senderName,
      senderPic: message.senderPic,
      attachment: message.attachment || null,
      createdAt: message.createdAt || new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    // Store updated messages
    localStorage.setItem(key, JSON.stringify(messages));
    
    return messages;
  } catch (error) {
    console.error('Error storing community message:', error);
    return [];
  }
};

// Get community messages
export const getCommunityMessages = (communityId) => {
  try {
    if (!communityId) {
      console.error('Community ID is required to get messages');
      return [];
    }
    
    const key = `community-messages-${communityId}`;
    const storedMessages = localStorage.getItem(key);
    
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (!Array.isArray(parsedMessages)) {
          console.warn(`Messages for community ${communityId} is not an array, returning empty array`);
          return [];
        }
        return parsedMessages;
      } catch (parseError) {
        console.error('Error parsing community messages:', parseError);
        return [];
      }
    }
  } catch (error) {
    console.error(`Error getting messages for community ${communityId}:`, error);
  }
  return [];
};

// Initialize community data
export const initializeCommunityData = () => {
  try {
    // Check if current user exists, if not create a default one
    if (!localStorage.getItem('user')) {
      // Create a default user
      const defaultUser = {
        _id: `user-${Date.now()}`,
        username: 'Campus User',
        name: 'Campus User',
        email: 'user@example.com',
        profilePicture: `https://ui-avatars.com/api/?name=Campus+User&background=random`,
        isOnline: true,
        isReal: true
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
    
    // Get the current user and ensure they're part of the community
    const currentUser = getCurrentUser();
    
    // Initialize community users if empty
    if (!localStorage.getItem('communityUsers')) {
      // Initialize with current user if available, otherwise empty array
      const initialUsers = currentUser ? [currentUser] : [];
      localStorage.setItem('communityUsers', JSON.stringify(initialUsers));
    } else {
      // Make sure current user is added to community
      if (currentUser) {
        addUserToCommunity(currentUser);
      }
      
      // Ensure all users have isReal flag
      const storedUsers = JSON.parse(localStorage.getItem('communityUsers'));
      const updatedUsers = storedUsers.map(user => ({
        ...user,
        isReal: user.isReal === false ? false : true
      }));
      localStorage.setItem('communityUsers', JSON.stringify(updatedUsers));
    }
    
    // No more sample users - we only want real users
    
    // Check if communities exist
    if (!localStorage.getItem('communities')) {
      // Create default communities
      const defaultCommunities = [
        {
          id: 'community-1',
          name: 'Campus General',
          description: 'General discussion for all students and faculty',
          image: 'https://ui-avatars.com/api/?name=Campus+General&background=0D8ABC&color=fff',
          members: [],
          createdAt: new Date().toISOString(),
          createdBy: null
        },
        {
          id: 'community-2',
          name: 'Engineering Hub',
          description: 'For engineering students and faculty',
          image: 'https://ui-avatars.com/api/?name=Engineering+Hub&background=F59E0B&color=fff',
          members: [],
          createdAt: new Date().toISOString(),
          createdBy: null
        },
        {
          id: 'community-3',
          name: 'Arts & Design',
          description: 'Creative space for artists and designers',
          image: 'https://ui-avatars.com/api/?name=Arts+Design&background=805AD5&color=fff',
          members: [],
          createdAt: new Date().toISOString(),
          createdBy: null
        }
      ];
      
      // Store default communities
      localStorage.setItem('communities', JSON.stringify(defaultCommunities));
    }
    
    // If current user exists, join them to the first community if they're not in any
    if (currentUser) {
      const userCommunities = getUserCommunities();
      if (userCommunities.length === 0) {
        const communities = getCommunities();
        if (communities.length > 0) {
          joinCommunity(communities[0].id);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing community data:', error);
    return false;
  }
}; 