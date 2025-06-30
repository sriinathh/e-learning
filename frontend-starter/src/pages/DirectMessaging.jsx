import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  HStack,
  Divider,
  Avatar,
  AvatarGroup,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useToast
} from '@chakra-ui/react';
import { FiEdit, FiUsers, FiUser, FiSearch, FiMessageSquare, FiPlus } from 'react-icons/fi';
import UsersList from '../components/UsersList';
import DirectMessage from '../components/DirectMessage';
import UserSearch from '../components/UserSearch';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { searchUsersByUsername, getUserByUsername, createGroupChat, getMockUsers } from '../utils/socketService';

const DirectMessaging = () => {
  const { currentUser, isAuthenticated } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isCreateGroupOpen, 
    onOpen: onOpenCreateGroup, 
    onClose: onCloseCreateGroup 
  } = useDisclosure();
  
  const { 
    isOpen: isSearchOpen, 
    onOpen: onOpenSearch, 
    onClose: onCloseSearch 
  } = useDisclosure();
  
  const navigate = useNavigate();
  const toast = useToast();
  
  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load recent chats
  useEffect(() => {
    if (!currentUser) return;
    
    // In a real app, we would fetch chat history from the server
    // For now, we'll create some mock chats
    const loadChats = async () => {
      const mockUsers = getMockUsers(currentUser.id).filter(user => !user.isCurrentUser);
      
      // Create recent chat entries with the first 3 users
      const recentChats = mockUsers.slice(0, 3).map(user => ({
        id: `chat-${user.id}`,
        type: 'direct',
        user: user,
        lastMessage: {
          text: `This is a message from ${user.name}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
          sender: user.id
        },
        unread: Math.floor(Math.random() * 3)
      }));
      
      // Add a mock group chat
      recentChats.push({
        id: 'group-1',
        type: 'group',
        name: 'Project Team',
        members: mockUsers.slice(0, 4),
        avatar: 'https://ui-avatars.com/api/?name=Project+Team&background=4caf50&color=fff',
        lastMessage: {
          text: 'Next meeting is on Friday',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
          sender: mockUsers[1].id,
          senderName: mockUsers[1].name
        },
        unread: 1
      });
      
      setChats(recentChats);
    };
    
    loadChats();
  }, [currentUser]);
  
  // Handle user selection from search
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    
    // Check if we already have a chat with this user
    const existingChat = chats.find(chat => 
      chat.type === 'direct' && chat.user.id === user.id
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create a new chat entry
      const newChat = {
        id: `chat-${user.id}`,
        type: 'direct',
        user: user,
        lastMessage: null,
        unread: 0
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
    }
    
    if (isMobile) {
      onOpen();
    }
  };
  
  // Handle chat selection
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    
    if (chat.type === 'direct') {
      setSelectedUser(chat.user);
    } else {
      setSelectedUser(null);
    }
    
    // Mark as read
    setChats(prev => 
      prev.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
    
    if (isMobile) {
      onOpen();
    }
  };
  
  // Handle username search
  const handleUsernameSearch = async () => {
    if (!searchUsername.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchUsersByUsername(searchUsername);
      // Filter out current user
      const filtered = results.filter(user => user.id !== currentUser?.id);
      setSearchResults(filtered);
      
      if (filtered.length === 0) {
        toast({
          title: 'No users found',
          description: `No users found with username "${searchUsername}"`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Error',
        description: 'Could not search for users. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle adding a member to the group
  const handleAddGroupMember = (user) => {
    if (!groupMembers.some(member => member.id === user.id)) {
      setGroupMembers(prev => [...prev, user]);
    }
  };
  
  // Handle removing a member from the group
  const handleRemoveGroupMember = (userId) => {
    setGroupMembers(prev => prev.filter(member => member.id !== userId));
  };
  
  // Handle creating a group
  const handleCreateGroup = () => {
    if (!groupName.trim() || groupMembers.length === 0) {
      toast({
        title: 'Cannot create group',
        description: 'Please provide a group name and add at least one member',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create the group
    const group = createGroupChat(groupName, groupMembers, currentUser.id);
    
    if (group) {
      // Add to chats
      const newGroupChat = {
        id: group.id,
        type: 'group',
        name: group.name,
        members: [...groupMembers, currentUser],
        avatar: group.avatar,
        lastMessage: null,
        unread: 0
      };
      
      setChats(prev => [newGroupChat, ...prev]);
      setSelectedChat(newGroupChat);
      
      // Reset group creation form
      setGroupName('');
      setGroupMembers([]);
      onCloseCreateGroup();
      
      toast({
        title: 'Group created',
        description: `Group "${groupName}" has been created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  if (!currentUser) {
    return (
      <Flex justify="center" align="center" minH="500px">
        <Text>Loading...</Text>
      </Flex>
    );
  }
  
  return (
    <Box p={4}>
      <HStack mb={6} justifyContent="space-between" alignItems="center">
        <Heading size="lg">Messages</Heading>
        <HStack>
          <UserSearch onSelectUser={handleSelectUser} />
          <IconButton
            icon={<FiEdit />}
            aria-label="New message"
            variant="outline"
            borderRadius="full"
            onClick={onOpenSearch}
          />
          <IconButton
            icon={<FiUsers />}
            aria-label="Create group"
            variant="outline"
            borderRadius="full"
            onClick={onOpenCreateGroup}
          />
        </HStack>
      </HStack>
      
      <Grid
        templateColumns={{ base: '1fr', md: '350px 1fr' }}
        gap={6}
        minH="70vh"
      >
        {/* Chats list - visible on desktop, hidden on mobile */}
        <GridItem display={{ base: 'block', md: 'block' }} borderWidth="1px" borderRadius="lg" bg="white">
          <VStack spacing={0} align="stretch" h="100%">
            <Box p={4} borderBottomWidth="1px">
              <Input
                placeholder="Search conversations..."
                borderRadius="full"
                size="md"
                bg="gray.100"
              />
            </Box>
            
            <Box flex="1" overflowY="auto" p={2}>
              {chats.length === 0 ? (
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  h="100%"
                  p={8}
                  textAlign="center"
                  color="gray.500"
                >
                  <FiMessageSquare size={40} />
                  <Text mt={4}>No conversations yet</Text>
                  <Button 
                    mt={4} 
                    leftIcon={<FiPlus />} 
                    colorScheme="blue" 
                    size="sm"
                    onClick={onOpenSearch}
                  >
                    Start a conversation
                  </Button>
                </Flex>
              ) : (
                <VStack spacing={2} align="stretch">
                  {chats.map(chat => (
                    <HStack
                      key={chat.id}
                      p={3}
                      borderRadius="md"
                      bg={selectedChat?.id === chat.id ? 'blue.50' : 'transparent'}
                      _hover={{ bg: selectedChat?.id === chat.id ? 'blue.50' : 'gray.50' }}
                      onClick={() => handleSelectChat(chat)}
                      cursor="pointer"
                    >
                      {chat.type === 'direct' ? (
                        <Avatar 
                          size="md" 
                          name={chat.user?.name} 
                          src={chat.user?.avatar} 
                        />
                      ) : (
                        <Avatar size="md" name={chat.name} src={chat.avatar} bg="green.500" />
                      )}
                      
                      <Box flex="1" overflow="hidden">
                        <HStack mb={1}>
                          <Text fontWeight="bold" noOfLines={1} flex="1">
                            {chat.type === 'direct' ? chat.user?.name : chat.name}
                          </Text>
                          {chat.lastMessage && (
                            <Text fontSize="xs" color="gray.500">
                              {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </Text>
                          )}
                        </HStack>
                        
                        <HStack>
                          <Text fontSize="sm" color="gray.600" noOfLines={1} flex="1">
                            {chat.lastMessage ? (
                              chat.type === 'group' && chat.lastMessage.sender !== currentUser.id ? (
                                <Text as="span">
                                  <Text as="span" fontWeight="medium">{chat.lastMessage.senderName}: </Text>
                                  {chat.lastMessage.text}
                                </Text>
                              ) : (
                                chat.lastMessage.text
                              )
                            ) : (
                              <Text as="i" color="gray.400">No messages yet</Text>
                            )}
                          </Text>
                          
                          {chat.unread > 0 && (
                            <Badge 
                              colorScheme="green" 
                              borderRadius="full"
                              px={2}
                            >
                              {chat.unread}
                            </Badge>
                          )}
                        </HStack>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </GridItem>
        
        {/* Chat area - desktop view */}
        <GridItem display={{ base: 'none', md: 'block' }}>
          {selectedChat ? (
            selectedChat.type === 'direct' ? (
              <DirectMessage 
                toUserId={selectedChat.user.id}
                toUserName={selectedChat.user.name}
                onClose={() => {
                  setSelectedChat(null);
                  setSelectedUser(null);
                }}
              />
            ) : (
              <Box 
                height="100%" 
                display="flex" 
                flexDirection="column"
                bg="white"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
              >
                <Flex 
                  p={4} 
                  borderBottom="1px solid" 
                  borderColor="gray.200"
                  align="center"
                  bg="green.50"
                >
                  <Avatar 
                    size="md" 
                    name={selectedChat.name} 
                    src={selectedChat.avatar} 
                    bg="green.500"
                    mr={3}
                  />
                  <Box>
                    <Heading size="md">{selectedChat.name}</Heading>
                    <Text fontSize="sm">
                      {selectedChat.members.length} members
                    </Text>
                  </Box>
                </Flex>
                
                <Flex
                  p={4}
                  justify="center"
                  align="center"
                  direction="column"
                  flex="1"
                  bg="gray.50"
                >
                  <Text>Group chat component will be implemented here</Text>
                </Flex>
              </Box>
            )
          ) : (
            <Flex 
              justify="center" 
              align="center" 
              h="100%" 
              bg="gray.50" 
              borderRadius="lg"
              direction="column"
              p={8}
              textAlign="center"
            >
              <Text fontSize="xl" mb={4}>Select a conversation</Text>
              <Text color="gray.500">
                Choose a conversation from the list or start a new one
              </Text>
            </Flex>
          )}
        </GridItem>
      </Grid>
      
      {/* Mobile drawer for chat */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedChat?.type === 'direct' 
                ? selectedChat?.user?.name 
                : selectedChat?.name || 'Chat'}
            </DrawerHeader>
            <DrawerBody p={0}>
              {selectedChat?.type === 'direct' && selectedUser && (
                <DirectMessage 
                  toUserId={selectedUser.id} 
                  toUserName={selectedUser.name}
                  onClose={onClose}
                />
              )}
              {selectedChat?.type === 'group' && (
                <Box p={4}>
                  <Text>Group chat component will be implemented here</Text>
                </Box>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      
      {/* Username search modal */}
      <Modal isOpen={isSearchOpen} onClose={onCloseSearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find a user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Input
                  placeholder="Enter username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUsernameSearch();
                    }
                  }}
                />
                <Button 
                  colorScheme="blue" 
                  onClick={handleUsernameSearch}
                  isLoading={isSearching}
                >
                  Search
                </Button>
              </HStack>
              
              {searchResults.length > 0 && (
                <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                  {searchResults.map(user => (
                    <HStack
                      key={user.id}
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Avatar size="sm" name={user.name} src={user.avatar} />
                      <Box flex="1">
                        <Text fontWeight="medium">{user.name}</Text>
                        {user.email && (
                          <Text fontSize="xs" color="gray.500">
                            {user.email}
                          </Text>
                        )}
                      </Box>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                          handleSelectUser(user);
                          onCloseSearch();
                        }}
                      >
                        Message
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCloseSearch}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Create group modal */}
      <Modal isOpen={isCreateGroupOpen} onClose={onCloseCreateGroup}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Group name</FormLabel>
                <Input
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </FormControl>
              
              <Divider />
              
              <Box>
                <Text fontWeight="medium" mb={2}>Group members ({groupMembers.length})</Text>
                
                {groupMembers.length > 0 && (
                  <Box mb={4}>
                    <AvatarGroup size="sm" max={5} mb={2}>
                      {groupMembers.map(member => (
                        <Avatar 
                          key={member.id} 
                          name={member.name} 
                          src={member.avatar} 
                        />
                      ))}
                    </AvatarGroup>
                    
                    <Flex wrap="wrap" gap={2}>
                      {groupMembers.map(member => (
                        <Badge
                          key={member.id}
                          colorScheme="blue"
                          borderRadius="full"
                          py={1}
                          px={2}
                          variant="solid"
                        >
                          {member.name}
                          <Button
                            size="xs"
                            variant="unstyled"
                            ml={1}
                            fontWeight="bold"
                            onClick={() => handleRemoveGroupMember(member.id)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}
                
                <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
                  <TabList>
                    <Tab>Recent contacts</Tab>
                    <Tab>Search</Tab>
                  </TabList>
                  
                  <TabPanels>
                    <TabPanel px={0}>
                      <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto">
                        {getMockUsers(currentUser.id)
                          .filter(user => !user.isCurrentUser)
                          .map(user => (
                            <HStack
                              key={user.id}
                              p={2}
                              borderRadius="md"
                              borderWidth="1px"
                              _hover={{ bg: 'gray.50' }}
                            >
                              <Avatar size="sm" name={user.name} src={user.avatar} />
                              <Text fontWeight="medium">{user.name}</Text>
                              <Button
                                size="xs"
                                colorScheme="blue"
                                ml="auto"
                                isDisabled={groupMembers.some(m => m.id === user.id)}
                                onClick={() => handleAddGroupMember(user)}
                              >
                                {groupMembers.some(m => m.id === user.id) ? 'Added' : 'Add'}
                              </Button>
                            </HStack>
                          ))}
                      </VStack>
                    </TabPanel>
                    
                    <TabPanel px={0}>
                      <UserSearch onSelectUser={handleAddGroupMember} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseCreateGroup}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateGroup}
              isDisabled={!groupName.trim() || groupMembers.length === 0}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DirectMessaging; 