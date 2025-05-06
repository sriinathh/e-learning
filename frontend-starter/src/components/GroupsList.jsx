import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  Divider,
  Badge,
  Tooltip,
  useColorModeValue,
  Icon,
  Heading,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagRightIcon,
  Collapse,
  IconButton
} from '@chakra-ui/react';
import { FaPlus, FaUsers, FaDoorOpen, FaDoorClosed, FaSearch, FaChevronDown, FaChevronUp, FaGlobe, FaLock, FaUserFriends, FaCrown } from 'react-icons/fa';
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getCurrentUser,
  getUserCommunities
} from '../utils/communityUtils';
import { 
  notifyCommunityCreated, 
  notifyCommunityJoined, 
  notifyCommunityLeft,
  onCommunityCreated,
  onCommunityJoined,
  onCommunityLeft
} from '../utils/communityEvents';

const GroupsList = ({ onSelectCommunity, activeCommunity }) => {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    image: '',
    isPrivate: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserCommunities, setShowUserCommunities] = useState(true);
  const [showDiscoverCommunities, setShowDiscoverCommunities] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const currentUser = getCurrentUser();
  
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightBg = useColorModeValue('teal.50', 'teal.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  
  // Load communities
  useEffect(() => {
    loadCommunities();
  }, []);
  
  // Subscribe to community events
  useEffect(() => {
    const createdUnsubscribe = onCommunityCreated(({ community }) => {
      loadCommunities();
    });
    
    const joinedUnsubscribe = onCommunityJoined(() => {
      loadCommunities();
    });
    
    const leftUnsubscribe = onCommunityLeft(() => {
      loadCommunities();
    });
    
    return () => {
      createdUnsubscribe();
      joinedUnsubscribe();
      leftUnsubscribe();
    };
  }, []);
  
  const loadCommunities = () => {
    try {
      const allCommunities = getCommunities();
      setCommunities(allCommunities);
      
      const userComms = getUserCommunities();
      setUserCommunities(userComms);
    } catch (error) {
      console.error('Error loading communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load communities',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle creating a new community
  const handleCreateCommunity = () => {
    try {
      if (!newCommunity.name.trim()) {
        toast({
          title: 'Missing information',
          description: 'Community name is required',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Generate placeholder image if not provided
      const communityImage = newCommunity.image || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(newCommunity.name)}&background=random&color=fff`;
      
      // Create the community
      const created = createCommunity({
        ...newCommunity,
        image: communityImage,
      });
      
      // Update state
      setCommunities(prev => [...prev, created]);
      setUserCommunities(prev => [...prev, created]);
      
      // Reset form
      setNewCommunity({
        name: '',
        description: '',
        image: '',
        isPrivate: false
      });
      
      // Close modal
      onClose();
      
      // Show success message
      toast({
        title: 'Community created',
        description: `${created.name} community has been created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Select the newly created community
      onSelectCommunity(created);
      
      // Notify about community creation
      notifyCommunityCreated(created);
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle joining a community
  const handleJoinCommunity = (community, e) => {
    e.stopPropagation();
    try {
      joinCommunity(community.id);
      loadCommunities(); // Reload communities
      
      // Notify about joining community
      notifyCommunityJoined(currentUser?._id, community.id);
      
      toast({
        title: 'Joined community',
        description: `You've joined ${community.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle leaving a community
  const handleLeaveCommunity = (community, e) => {
    e.stopPropagation();
    try {
      leaveCommunity(community.id);
      loadCommunities(); // Reload communities
      
      // Notify about leaving community
      notifyCommunityLeft(currentUser?._id, community.id);
      
      // If the active community is the one being left, clear selection
      if (activeCommunity && activeCommunity.id === community.id) {
        onSelectCommunity(null);
      }
      
      toast({
        title: 'Left community',
        description: `You've left ${community.name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to leave community',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Check if user is a member of a community
  const isMember = (community) => {
    return community.members.includes(currentUser?._id);
  };
  
  // Filter communities based on search
  const filteredUserCommunities = userCommunities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDiscoverCommunities = communities
    .filter(community => !isMember(community))
    .filter(community => 
      community.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  return (
    <Box 
      height="100%"
      bg={bgColor}
      display="flex"
      flexDirection="column"
    >
      <Box 
        p={4} 
        bg={useColorModeValue('teal.600', 'teal.800')} 
        color="white"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Flex alignItems="center">
            <Icon as={FaUsers} mr={2} />
            <Heading size="md">Communities</Heading>
          </Flex>
          <Tooltip label="Create new community">
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              leftIcon={<FaPlus />}
              onClick={onOpen}
              _hover={{ bg: 'teal.500' }}
              borderColor="teal.200"
            >
              New
            </Button>
          </Tooltip>
        </Flex>
        
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search communities..."
            bg="whiteAlpha.300"
            borderRadius="md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _placeholder={{ color: 'gray.300' }}
            _hover={{ bg: 'whiteAlpha.400' }}
            _focus={{ bg: 'white', color: 'gray.800' }}
            boxShadow="sm"
          />
        </InputGroup>
      </Box>
      
      <Box flex="1" overflowY="auto" p={3}>
        {/* My Communities Section */}
        <Box mb={4} bg={cardBg} borderRadius="md" boxShadow="sm" overflow="hidden">
          <Flex 
            p={3}
            alignItems="center" 
            justifyContent="space-between"
            onClick={() => setShowUserCommunities(!showUserCommunities)}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
            transition="all 0.2s"
          >
            <HStack>
              <Icon as={FaUserFriends} color="teal.500" />
              <Text fontWeight="600" color={textColor}>MY COMMUNITIES</Text>
              <Badge colorScheme="teal" borderRadius="full">
                {userCommunities.length}
              </Badge>
            </HStack>
            <Icon 
              as={showUserCommunities ? FaChevronUp : FaChevronDown} 
              color="gray.500"
            />
          </Flex>
          
          <Collapse in={showUserCommunities}>
            <Box px={2} pb={2}>
              {filteredUserCommunities.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {filteredUserCommunities.map(community => (
                    <Flex
                      key={community.id}
                      p={2}
                      borderRadius="md"
                      bg={activeCommunity?.id === community.id ? highlightBg : 'transparent'}
                      _hover={{ bg: hoverBg }}
                      onClick={() => onSelectCommunity(community)}
                      cursor="pointer"
                      transition="all 0.2s"
                      alignItems="center"
                    >
                      <Box position="relative">
                        <Image
                          src={community.image}
                          alt={community.name}
                          boxSize="40px"
                          borderRadius="full"
                          objectFit="cover"
                          border="2px solid"
                          borderColor={activeCommunity?.id === community.id ? "teal.400" : "transparent"}
                          fallbackSrc="https://via.placeholder.com/40"
                        />
                        {community.createdBy === currentUser?._id && (
                          <Tooltip label="You created this community">
                            <Icon
                              as={FaCrown}
                              color="yellow.400"
                              position="absolute"
                              bottom="-4px"
                              right="-4px"
                              bg="white"
                              borderRadius="full"
                              boxSize="16px"
                            />
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Box ml={3} flex="1">
                        <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                          {community.name}
                        </Text>
                        <Flex align="center">
                          <Icon 
                            as={community.isPrivate ? FaLock : FaGlobe} 
                            color="gray.500" 
                            boxSize="12px"
                            mr={1}
                          />
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {community.members.length} {community.members.length === 1 ? 'member' : 'members'}
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Tooltip label="Leave community">
                        <IconButton
                          icon={<FaDoorOpen />}
                          size="sm"
                          aria-label="Leave community"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => handleLeaveCommunity(community, e)}
                        />
                      </Tooltip>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    {searchQuery 
                      ? 'No communities match your search' 
                      : 'You haven\'t joined any communities yet'}
                  </Text>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
        
        {/* Discover Communities Section */}
        <Box bg={cardBg} borderRadius="md" boxShadow="sm" overflow="hidden">
          <Flex 
            p={3}
            alignItems="center" 
            justifyContent="space-between"
            onClick={() => setShowDiscoverCommunities(!showDiscoverCommunities)}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
            transition="all 0.2s"
          >
            <HStack>
              <Icon as={FaGlobe} color="blue.500" />
              <Text fontWeight="600" color={textColor}>DISCOVER</Text>
              <Badge colorScheme="blue" borderRadius="full">
                {communities.filter(community => !isMember(community)).length}
              </Badge>
            </HStack>
            <Icon 
              as={showDiscoverCommunities ? FaChevronUp : FaChevronDown} 
              color="gray.500"
            />
          </Flex>
          
          <Collapse in={showDiscoverCommunities}>
            <Box px={2} pb={2}>
              {filteredDiscoverCommunities.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {filteredDiscoverCommunities.map(community => (
                    <Flex
                      key={community.id}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: hoverBg }}
                      onClick={() => onSelectCommunity(community)}
                      cursor="pointer"
                      transition="all 0.2s"
                      alignItems="center"
                    >
                      <Image
                        src={community.image}
                        alt={community.name}
                        boxSize="40px"
                        borderRadius="full"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/40"
                      />
                      
                      <Box ml={3} flex="1">
                        <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                          {community.name}
                        </Text>
                        <Flex align="center">
                          <Icon 
                            as={community.isPrivate ? FaLock : FaGlobe} 
                            color="gray.500" 
                            boxSize="12px"
                            mr={1}
                          />
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {community.description || `${community.members.length} members`}
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Tooltip label="Join community">
                        <IconButton
                          icon={<FaDoorClosed />}
                          size="sm"
                          aria-label="Join community"
                          variant="ghost"
                          colorScheme="green"
                          onClick={(e) => handleJoinCommunity(community, e)}
                        />
                      </Tooltip>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    {searchQuery 
                      ? 'No communities match your search' 
                      : 'No new communities to discover'}
                  </Text>
                  {!searchQuery && (
                    <Button
                      mt={2}
                      size="sm"
                      leftIcon={<FaPlus />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={onOpen}
                    >
                      Create One
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
      
      {/* Create Community Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaPlus} mr={2} color="teal.500" />
              Create New Community
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" isRequired mb={4}>
              <FormLabel>Community Name</FormLabel>
              <Input
                placeholder="Enter community name"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
              />
            </FormControl>
            
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe your community"
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                rows={3}
              />
            </FormControl>
            
            <FormControl id="image" mb={4}>
              <FormLabel>Image URL (optional)</FormLabel>
              <Input
                placeholder="Enter image URL"
                value={newCommunity.image}
                onChange={(e) => setNewCommunity({...newCommunity, image: e.target.value})}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Leave blank for an auto-generated image
              </Text>
            </FormControl>
            
            <FormControl id="privacy">
              <FormLabel>Privacy</FormLabel>
              <Flex>
                <Button
                  flex="1"
                  leftIcon={<FaGlobe />}
                  colorScheme={!newCommunity.isPrivate ? "teal" : "gray"}
                  variant={!newCommunity.isPrivate ? "solid" : "outline"}
                  onClick={() => setNewCommunity({...newCommunity, isPrivate: false})}
                  mr={2}
                >
                  Public
                </Button>
                <Button
                  flex="1"
                  leftIcon={<FaLock />}
                  colorScheme={newCommunity.isPrivate ? "teal" : "gray"}
                  variant={newCommunity.isPrivate ? "solid" : "outline"}
                  onClick={() => setNewCommunity({...newCommunity, isPrivate: true})}
                >
                  Private
                </Button>
              </Flex>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {newCommunity.isPrivate 
                  ? 'Only members can see and join this community' 
                  : 'Anyone can discover and join this community'}
              </Text>
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleCreateCommunity}
              leftIcon={<FaPlus />}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GroupsList; 