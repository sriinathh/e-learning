import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Input, 
  useToast, 
  Avatar, 
  VStack, 
  HStack, 
  Heading, 
  Spinner, 
  Divider, 
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  IconButton,
  Image
} from '@chakra-ui/react';
import { FiUsers, FiMessageCircle, FiSearch, FiPlus, FiLogOut, FiCamera, FiUserPlus } from 'react-icons/fi';
import UsersList from '../components/UsersList';
import ChatArea from '../components/ChatArea';
import { getMockCommunities } from '../utils/socketService';
import { useSocket } from '../context/SocketContext';
import { createTestUser } from '../utils/mockUser';
import './Community.css';

const CommunityPage = () => {
  const { socket } = useSocket();
  const [communities, setCommunities] = useState([]);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const toast = useToast();
  
  // Create community state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');
  const [newCommunityPhoto, setNewCommunityPhoto] = useState(null);
  const [newCommunityPhotoPreview, setNewCommunityPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  // Initialize user from localStorage
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser({
          id: userData.id || userData._id,
          name: userData.name || userData.username || 'User',
          email: userData.email,
          avatar: userData.avatar || userData.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.username || 'User')}&background=random`,
        });
      } else {
        // Fallback user if not logged in
        setUser({
          id: 'guest-' + Math.random().toString(36).substr(2, 9),
          name: 'Guest User',
          avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=random'
        });
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser({
        id: 'guest-' + Math.random().toString(36).substr(2, 9),
        name: 'Guest User',
        avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=random'
      });
    }
  }, []);

  // Fetch communities
  useEffect(() => {
    if (socket) {
      setLoading(true);
      
      // Request communities list from server
      socket.emit('get_communities');
      
      // Listen for communities list
      socket.on('communities_list', (communitiesList) => {
        setCommunities(communitiesList);
        if (!currentCommunity) {
          setCurrentCommunity(communitiesList.find(c => c.isJoined) || null);
        }
        setLoading(false);
      });
      
      // If no response in 3 seconds, use mock data
      const timeout = setTimeout(() => {
        if (loading) {
          const mockCommunities = getMockCommunities().map(community => ({
            ...community,
            description: "This is a sample community for discussion and collaboration.",
            photo: `https://picsum.photos/seed/${community.id}/200/200`
          }));
          
          setCommunities(mockCommunities);
          if (!currentCommunity) {
            setCurrentCommunity(mockCommunities.find(c => c.isJoined) || null);
          }
          setLoading(false);
        }
      }, 3000);
      
      // Listen for community updates
      socket.on('community_updated', (updatedCommunity) => {
        setCommunities(prev => 
          prev.map(comm => comm.id === updatedCommunity.id ? updatedCommunity : comm)
        );
        
        // If current community is updated, update it
        if (currentCommunity?.id === updatedCommunity.id) {
          setCurrentCommunity(updatedCommunity);
        }
      });
      
      // Listen for new communities
      socket.on('new_community', (newCommunity) => {
        setCommunities(prev => [...prev, newCommunity]);
      });
      
      return () => {
        clearTimeout(timeout);
        socket.off('communities_list');
        socket.off('community_updated');
        socket.off('new_community');
      };
    }
  }, [socket]); // Only depend on socket changes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCommunityPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCommunityPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    // Reset form
    setNewCommunityName('');
    setNewCommunityDesc('');
    setNewCommunityPhoto(null);
    setNewCommunityPhotoPreview('');
  };

  const createCommunity = () => {
    if (!newCommunityName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a community name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // In a real app, you would upload the photo to a server
    // Here we'll use the data URL for the mock
    const photoUrl = newCommunityPhotoPreview || `https://picsum.photos/seed/${Date.now()}/200/200`;
    
    const newCommunity = {
      id: Date.now().toString(),
      name: newCommunityName,
      description: newCommunityDesc || `A community for ${newCommunityName}`,
      photo: photoUrl,
      members: 1,
      isJoined: true,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    if (socket) {
      socket.emit('create_community', newCommunity);
    }
    
    setCommunities([...communities, newCommunity]);
    setCurrentCommunity(newCommunity);
    closeCreateModal();
    
    toast({
      title: 'Success',
      description: `Community "${newCommunityName}" created!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const joinCommunity = (communityId) => {
    if (!socket || !user) return;
    
    // Emit join event with user data
    socket.emit('join_community', { 
      userId: user.id, 
      communityId,
      userInfo: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email
      }
    });
    
    // Update local state (the socket service will broadcast the update to all clients)
    // We don't need to update communities here as the socket event will handle it
    
    // But we can update the UI immediately for better experience
    const community = communities.find(c => c.id === communityId);
    if (community) {
      setCurrentCommunity(community);
    }
    
    toast({
      title: 'Joined',
      description: `You've joined the community!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const leaveCommunity = (communityId) => {
    if (!socket || !user) return;
    
    // Emit leave event
    socket.emit('leave_community', { userId: user.id, communityId });
    
    // We don't need to update communities here as the socket event will handle it
    
    // But update the current community immediately for better UX
    const remaining = communities.filter(c => c.isJoined && c.id !== communityId);
    setCurrentCommunity(remaining.length > 0 ? remaining[0] : null);
    
    toast({
      title: 'Left',
      description: `You've left the community`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredCommunities = communities.filter(comm => 
    comm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comm.description && comm.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) return <Spinner size="xl" />;

  return (
    <Flex className="community-container" h="calc(100vh - 80px)" bg="gray.50">
      {/* Left sidebar - Communities list */}
      <Box className="communities-sidebar" w="300px" bg="white" boxShadow="sm" p={4} overflowY="auto">
        <VStack spacing={4} align="stretch">
          <Heading size="md" mb={2}>Communities</Heading>
          
          <Button 
            colorScheme="teal" 
            leftIcon={<FiPlus />} 
            onClick={openCreateModal}
            mb={2}
          >
            Create Community
          </Button>
          
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FiSearch />}
            mb={2}
          />
          
          <Divider />
          
          {loading ? (
            <Spinner />
          ) : (
            <VStack spacing={3} align="stretch" mt={2}>
              {filteredCommunities.map((community) => (
                <Box 
                  key={community.id}
                  p={3}
                  borderRadius="md"
                  bg={currentCommunity?.id === community.id ? "teal.50" : "white"}
                  borderWidth="1px"
                  borderColor={currentCommunity?.id === community.id ? "teal.300" : "gray.200"}
                  _hover={{ bg: "gray.50" }}
                  cursor="pointer"
                  onClick={() => community.isJoined && setCurrentCommunity(community)}
                >
                  <Flex align="center" mb={2}>
                    <Avatar 
                      size="sm" 
                      name={community.name} 
                      src={community.photo} 
                      mr={2}
                    />
                    <Text fontWeight="bold">{community.name}</Text>
                  </Flex>
                  
                  {community.description && (
                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                      {community.description}
                    </Text>
                  )}
                  
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      <FiUsers style={{ display: 'inline', marginRight: '5px' }} />
                      {community.members} members
                    </Text>
                    
                    {community.isJoined ? (
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="outline"
                        leftIcon={<FiLogOut />}
                        onClick={(e) => {
                          e.stopPropagation();
                          leaveCommunity(community.id);
                        }}
                      >
                        Leave
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        colorScheme="teal"
                        onClick={(e) => {
                          e.stopPropagation();
                          joinCommunity(community.id);
                        }}
                      >
                        Join
                      </Button>
                    )}
                  </Flex>
                </Box>
              ))}
              
              {filteredCommunities.length === 0 && (
                <Box p={4} textAlign="center">
                  <Text color="gray.500">No communities found</Text>
                  <Button 
                    mt={4} 
                    colorScheme="teal" 
                    size="sm" 
                    onClick={openCreateModal}
                  >
                    Create one
                  </Button>
                </Box>
              )}
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Middle - Chat area */}
      <Box flex={1} bg="white" borderWidth="1px" borderColor="gray.200" p={0}>
        {currentCommunity ? (
          <ChatArea 
            socket={socket}
            community={currentCommunity}
            user={user}
          />
        ) : (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            h="100%" 
            p={8}
            bg="gray.50"
          >
            <FiMessageCircle size={60} color="#A0AEC0" />
            <Text fontSize="xl" mt={4} textAlign="center" color="gray.500">
              Join or create a community to start chatting
            </Text>
            <Button 
              mt={4} 
              colorScheme="teal" 
              leftIcon={<FiPlus />} 
              onClick={openCreateModal}
            >
              Create Community
            </Button>
          </Flex>
        )}
      </Box>

      {/* Right sidebar - Users list */}
      <Box w="280px" bg="white" boxShadow="sm" p={4} overflowY="auto">
        <VStack spacing={4} align="stretch">
          <Button 
            size="sm" 
            colorScheme="purple" 
            leftIcon={<FiUserPlus />}
            onClick={() => {
              // Create a test user with random name
              const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi'];
              const randomName = names[Math.floor(Math.random() * names.length)];
              const newUser = createTestUser(randomName);
              
              // Refresh the page to reload with new user
              window.location.reload();
            }}
          >
            Switch Test User
          </Button>
          
          <UsersList 
            socket={socket}
            communityId={currentCommunity?.id}
            currentUser={user}
          />
        </VStack>
      </Box>
      
      {/* Create Community Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Community</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Flex 
                w="full" 
                justify="center" 
                direction="column" 
                align="center"
              >
                <Box 
                  position="relative" 
                  mb={4}
                >
                  <Avatar 
                    size="xl" 
                    src={newCommunityPhotoPreview || 'https://via.placeholder.com/150?text=Community'}
                    name={newCommunityName || "New Community"}
                  />
                  <IconButton
                    icon={<FiCamera />}
                    aria-label="Upload photo"
                    size="sm"
                    colorScheme="teal"
                    isRound
                    position="absolute"
                    bottom="0"
                    right="0"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </Box>
                <Text fontSize="sm" color="gray.500">
                  Click on the camera icon to upload a community photo
                </Text>
              </Flex>
              
              <FormControl isRequired>
                <FormLabel>Community Name</FormLabel>
                <Input 
                  placeholder="Enter community name" 
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Describe your community" 
                  value={newCommunityDesc}
                  onChange={(e) => setNewCommunityDesc(e.target.value)}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={createCommunity}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CommunityPage; 