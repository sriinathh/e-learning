import { useState, useEffect, useCallback } from 'react';
import { 
  getCommunities, 
  getUserCommunities, 
  getCommunityUsers, 
  getCurrentUser,
  getCommunityMessages,
  getDirectMessages
} from '../utils/communityUtils';
import { 
  onCommunityCreated, 
  onCommunityJoined, 
  onCommunityLeft,
  onUserOnline,
  onUserOffline,
  onMessageReceived
} from '../utils/communityEvents';

// Custom hook for community state management
const useCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [communityUsers, setCommunityUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = getCurrentUser();
      setCurrentUser(user);
      
      // Get communities
      const allCommunities = getCommunities();
      setCommunities(allCommunities);
      
      // Get user communities
      const userComms = getUserCommunities();
      setUserCommunities(userComms);
      
      // Get community users
      const users = getCommunityUsers();
      setCommunityUsers(users);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading community data:', err);
      setError('Failed to load community data. Please try again.');
      setLoading(false);
    }
  }, []);

  // Initialize data and subscribe to events
  useEffect(() => {
    loadData();
    
    // Subscribe to events
    const createdUnsubscribe = onCommunityCreated(() => loadData());
    const joinedUnsubscribe = onCommunityJoined(() => loadData());
    const leftUnsubscribe = onCommunityLeft(() => loadData());
    const userOnlineUnsubscribe = onUserOnline(() => loadData());
    const userOfflineUnsubscribe = onUserOffline(() => loadData());
    const messageReceivedUnsubscribe = onMessageReceived(() => {
      // For now, we don't need to reload all data for messages
      // We can optimize this later
    });
    
    return () => {
      createdUnsubscribe();
      joinedUnsubscribe();
      leftUnsubscribe();
      userOnlineUnsubscribe();
      userOfflineUnsubscribe();
      messageReceivedUnsubscribe();
    };
  }, [loadData]);

  // Get messages for a community
  const getCommunityMessagesData = useCallback((communityId) => {
    if (!communityId) return [];
    return getCommunityMessages(communityId);
  }, []);

  // Get direct messages between two users
  const getDirectMessagesData = useCallback((user1Id, user2Id) => {
    if (!user1Id || !user2Id) return [];
    return getDirectMessages(user1Id, user2Id);
  }, []);

  return {
    communities,
    userCommunities,
    communityUsers,
    currentUser,
    loading,
    error,
    loadData,
    getCommunityMessagesData,
    getDirectMessagesData
  };
};

export default useCommunity; 