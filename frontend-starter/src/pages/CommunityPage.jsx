import React, { useState, useEffect, useRef } from 'react';
import {
  Box, 
  Flex, 
  Grid, 
  GridItem,
  Text, 
  Heading, 
  Button,
  Icon,
  useToast,
  useDisclosure,
  Spinner,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FiUsers, FiMessageSquare, FiPlus, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import CommunityList from '../components/community/CommunityList';
import CommunityChat from '../components/community/CommunityChat';
import CommunityMembers from '../components/community/CommunityMembers';
import CommunityModal from '../components/community/CommunityModal';
import DirectMessaging from '../components/community/DirectMessaging';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

const CommunityPage = () => {
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // Socket context
  const { 
    socket, 
    connected, 
    connectionError,
    joinCommunity, 
    leaveCommunity, 
    sendCommunityMessage,
    sendDirectMessage
  } = useSocket();
  
  // States
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [directMessageUser, setDirectMessageUser] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  
  // Modal controls
  const { 
    isOpen: isCreateCommunityOpen, 
    onOpen: onCreateCommunityOpen, 
    onClose: onCreateCommunityClose 
  } = useDisclosure();
  
  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  });
  
  // Get token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for new community messages
    socket.on('newCommunityMessage', (message) => {
      // Only update messages if we're in the same community
      if (selectedCommunity && message.community === selectedCommunity._id) {
        setMessages(prevMessages => [...prevMessages, message]);
        scrollToBottom();
      }
    });
    
    // Listen for new direct messages
    socket.on('newDirectMessage', (message) => {
      // Only update messages if we're chatting with this user
      if (directMessageUser && 
         (message.sender._id === directMessageUser._id || 
          message.recipient._id === directMessageUser._id)) {
        setDirectMessages(prevMessages => [...prevMessages, message]);
        scrollToBottom();
      }
    });
    
    // Listen for user status changes
    socket.on('userStatusChange', ({ userId, status }) => {
      // Update active users list
      setActiveUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isOnline: status === 'online' } 
            : user
        )
      );
      
      // Update members list if in a community
      if (selectedCommunity) {
        setMembers(prevMembers => 
          prevMembers.map(member => 
            member._id === userId 
              ? { ...member, isOnline: status === 'online' } 
              : member
          )
        );
      }
    });
    
    return () => {
      socket.off('newCommunityMessage');
      socket.off('newDirectMessage');
      socket.off('userStatusChange');
    };
  }, [socket, selectedCommunity, directMessageUser]);
  
  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      const response = await axios.get(`${API_URL}/community`, { 
        headers: getAuthHeader()
      });
      setCommunities(response.data);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch communities',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch community details
  const fetchCommunityDetails = async (communityId) => {
    try {
      const response = await axios.get(`${API_URL}/community/${communityId}`, {
        headers: getAuthHeader()
      });
      setSelectedCommunity(response.data);
      setMembers(response.data.members || []);
      fetchCommunityMessages(communityId);
      
      // Join the community room for real-time updates
      joinCommunity(communityId);
    } catch (error) {
      console.error('Error fetching community details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch community details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Fetch community messages
  const fetchCommunityMessages = async (communityId, pageNum = 0) => {
    try {
      if (pageNum === 0) {
        setMessages([]);
        setPage(0);
      }
      
      setLoadingMoreMessages(pageNum > 0);
      
      const response = await axios.get(
        `${API_URL}/community/${communityId}/messages?page=${pageNum}&limit=50`, 
        { headers: getAuthHeader() }
      );
      
      if (pageNum === 0) {
        setMessages(response.data.messages);
      } else {
        setMessages(prev => [...response.data.messages, ...prev]);
      }
      
      setHasMoreMessages(response.data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingMoreMessages(false);
    }
  };
  
  // Fetch active users
  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/community/users/active`, {
        headers: getAuthHeader()
      });
      setActiveUsers(response.data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };
  
  // Fetch direct messages
  const fetchDirectMessages = async (userId) => {
    try {
      setDirectMessages([]);
      const response = await axios.get(`${API_URL}/community/direct/${userId}`, {
        headers: getAuthHeader()
      });
      setDirectMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching direct messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch direct messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle creating a new community
  const handleCreateCommunity = async (communityData) => {
    try {
      const response = await axios.post(`${API_URL}/community`, communityData, {
        headers: getAuthHeader()
      });
      
      setCommunities(prev => [...prev, response.data]);
      toast({
        title: 'Success',
        description: 'Community created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreateCommunityClose();
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle joining a community
  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(`${API_URL}/community/${communityId}/join`, {}, {
        headers: getAuthHeader()
      });
      
      // Update communities list
      fetchCommunities();
      
      // If selected community is the one joined, refresh details
      if (selectedCommunity && selectedCommunity._id === communityId) {
        fetchCommunityDetails(communityId);
      }
      
      // Join the community room for real-time updates
      joinCommunity(communityId);
      
      toast({
        title: 'Success',
        description: 'Joined community successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to join community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle leaving a community
  const handleLeaveCommunity = async (communityId) => {
    try {
      await axios.post(`${API_URL}/community/${communityId}/leave`, {}, {
        headers: getAuthHeader()
      });
      
      // Update communities list
      fetchCommunities();
      
      // If selected community is the one left, clear selection
      if (selectedCommunity && selectedCommunity._id === communityId) {
        setSelectedCommunity(null);
        setMessages([]);
        setMembers([]);
      }
      
      // Leave the community room
      leaveCommunity(communityId);
      
      toast({
        title: 'Success',
        description: 'Left community successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to leave community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle sending a message to a community
  const handleSendCommunityMessage = async (content, attachments = []) => {
    if (!selectedCommunity) return;
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await axios.post(
        `${API_URL}/community/${selectedCommunity._id}/messages`, 
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Add message to local state
      setMessages(prev => [...prev, response.data]);
      
      // Send the message through the socket for real-time updates
      sendCommunityMessage(response.data);
      
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle sending a direct message
  const handleSendDirectMessage = async (content, attachments = []) => {
    if (!directMessageUser) return;
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await axios.post(
        `${API_URL}/community/direct/${directMessageUser._id}`, 
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Add message to local state
      setDirectMessages(prev => [...prev, response.data]);
      
      // Send the message through the socket for real-time updates
      sendDirectMessage(response.data);
      
      scrollToBottom();
    } catch (error) {
      console.error('Error sending direct message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send direct message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle selecting a community
  const handleSelectCommunity = (community) => {
    // If we were already in a community, leave that room
    if (selectedCommunity) {
      leaveCommunity(selectedCommunity._id);
    }
    
    setSelectedCommunity(community);
    fetchCommunityDetails(community._id);
    setDirectMessageUser(null);
    setDirectMessages([]);
  };
  
  // Handle selecting a user for direct messaging
  const handleSelectDirectUser = (user) => {
    // If we were in a community, leave that room
    if (selectedCommunity) {
      leaveCommunity(selectedCommunity._id);
    }
    
    setSelectedCommunity(null);
    setDirectMessageUser(user);
    fetchDirectMessages(user._id);
  };
  
  // Load more messages
  const handleLoadMoreMessages = () => {
    if (loadingMoreMessages || !hasMoreMessages) return;
    
    if (selectedCommunity) {
      fetchCommunityMessages(selectedCommunity._id, page + 1);
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Initial data loading
  useEffect(() => {
    fetchCommunities();
    fetchActiveUsers();
    
    // Refresh active users periodically
    const intervalId = setInterval(() => {
      fetchActiveUsers();
    }, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, directMessages]);

  // Function to handle server restart
  const handleRestartServer = () => {
    toast({
      title: "Attempting to reconnect",
      description: "Please wait while we try to reconnect to the server",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    
    // Refresh the page to reinitialize the socket connection
    window.location.reload();
  };
  
  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Community Chat</Heading>
        <Button 
          leftIcon={<Icon as={FiPlus} />} 
          colorScheme="blue" 
          onClick={onCreateCommunityOpen}
        >
          Create Community
        </Button>
      </Flex>
      
      {connectionError && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon as={FiAlertTriangle} />
          <Box flex="1">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Could not connect to the chat server. Make sure the backend server is running.
            </AlertDescription>
          </Box>
          <Button colorScheme="red" size="sm" onClick={handleRestartServer}>
            Reconnect
          </Button>
        </Alert>
      )}
      
      {!connected && !connectionError && (
        <Box mb={4} p={2} bg="yellow.100" borderRadius="md">
          <Text>Connecting to server...</Text>
        </Box>
      )}
      
      {loading ? (
        <Flex justify="center" align="center" height="60vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "300px 1fr 250px" }} gap={4}>
          {/* Communities List */}
          <GridItem>
            <Flex direction="column" h="75vh" borderWidth={1} borderRadius="md" overflow="hidden">
              <Box p={3} bg="blue.500" color="white">
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Icon as={FiUsers} mr={2} />
                    <Text fontWeight="bold">Communities</Text>
                  </Flex>
                  <Button size="sm" variant="outline" colorScheme="whiteAlpha" leftIcon={<FiRefreshCw />} onClick={fetchCommunities}>
                    Refresh
                  </Button>
                </Flex>
              </Box>
              <Box flex="1" overflowY="auto" bg="gray.50">
                <CommunityList 
                  communities={communities}
                  currentUser={currentUser}
                  selectedCommunity={selectedCommunity}
                  onSelectCommunity={handleSelectCommunity}
                  onJoinCommunity={handleJoinCommunity}
                  onLeaveCommunity={handleLeaveCommunity}
                />
              </Box>
              <Box p={3} bg="gray.100">
                <Text fontSize="sm">
                  <Badge colorScheme={connected ? "green" : "red"} mr={1}>
                    {connected ? "Connected" : "Disconnected"}
                  </Badge>
                  {connected && <span>{activeUsers.filter(u => u.isOnline).length} users online</span>}
                </Text>
              </Box>
            </Flex>
          </GridItem>
          
          {/* Chat Area */}
          <GridItem>
            {selectedCommunity ? (
              <CommunityChat 
                community={selectedCommunity}
                messages={messages} 
                currentUser={currentUser}
                onSendMessage={handleSendCommunityMessage}
                hasMoreMessages={hasMoreMessages}
                onLoadMoreMessages={handleLoadMoreMessages}
                loadingMoreMessages={loadingMoreMessages}
                messagesEndRef={messagesEndRef}
                isConnected={connected}
              />
            ) : directMessageUser ? (
              <DirectMessaging
                recipient={directMessageUser}
                messages={directMessages}
                currentUser={currentUser}
                onSendMessage={handleSendDirectMessage}
                messagesEndRef={messagesEndRef}
                isConnected={connected}
              />
            ) : (
              <Flex 
                direction="column" 
                justify="center" 
                align="center" 
                h="75vh" 
                borderWidth={1} 
                borderRadius="md"
                bg="gray.50"
              >
                <Icon as={FiMessageSquare} boxSize={12} color="gray.300" mb={4} />
                <Text fontSize="lg" color="gray.500">
                  Select a community or user to start chatting
                </Text>
                {connectionError && (
                  <Text mt={2} color="red.500" fontSize="sm">
                    Note: Real-time features will be unavailable until the server connection is restored.
                  </Text>
                )}
              </Flex>
            )}
          </GridItem>
          
          {/* Members List */}
          <GridItem>
            <Flex direction="column" h="75vh" borderWidth={1} borderRadius="md" overflow="hidden">
              <Box p={3} bg="blue.500" color="white">
                <Flex align="center">
                  <Icon as={FiUsers} mr={2} />
                  <Text fontWeight="bold">Members & Contacts</Text>
                </Flex>
              </Box>
              <Box flex="1" overflowY="auto" bg="gray.50">
                <CommunityMembers 
                  members={selectedCommunity ? members : []}
                  activeUsers={activeUsers}
                  currentUser={currentUser}
                  selectedUser={directMessageUser}
                  onSelectUser={handleSelectDirectUser}
                  showAllUsers={!selectedCommunity}
                />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      )}
      
      {/* Create Community Modal */}
      <CommunityModal 
        isOpen={isCreateCommunityOpen} 
        onClose={onCreateCommunityClose}
        onSubmit={handleCreateCommunity}
      />
    </Box>
  );
};

export default CommunityPage; 