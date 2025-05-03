import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  useDisclosure, 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Icon,
  Text,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast
} from '@chakra-ui/react';
import { FiUsers, FiMenu, FiMessageCircle, FiLayers } from 'react-icons/fi';
import ChatArea from '../components/ChatArea';
import UsersList from '../components/UsersList';
import GroupsList from '../components/GroupsList';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

const CommunityChat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    fetchMessages, 
    fetchOnlineUsers, 
    fetchGroups,
    fetchGroupDetails,
    fetchGroupMessages,
    clearCurrentGroup,
    setCurrentGroup,
    getLocalUsers, 
    getLocalMessages,
    getLocalGroups,
    currentGroup
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // In a real app, you'd use fetchMessages and fetchOnlineUsers
    // For demo, we're using local data
    const localUsers = getLocalUsers();
    setUsers(localUsers);
    
    // Load local groups
    const localGroups = getLocalGroups();
    useChatStore.setState({ groups: localGroups });
    
    // Simulate general chat messages
    useChatStore.setState({ messages: getLocalMessages() });

    // Simulate periodic updates
    const interval = setInterval(() => {
      setUsers(prev => {
        return prev.map(user => {
          // Randomly toggle online status for demo
          if (user._id !== authUser?._id) {
            return {
              ...user,
              isOnline: Math.random() > 0.3
            };
          }
          return user;
        });
      });
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(interval);
      clearCurrentGroup(); // Clear current group when component unmounts
    };
  }, [fetchMessages, fetchOnlineUsers, getLocalUsers, getLocalMessages, getLocalGroups, authUser, clearCurrentGroup]);

  const handleGroupSelect = async (group) => {
    // In a real app, you'd fetch group details and messages
    // For demo, we'll simulate this
    
    try {
      // Set current group
      setCurrentGroup({
        ...group,
        members: users.slice(0, Math.floor(Math.random() * 4) + 2), // Random subset of users
        isMember: Math.random() > 0.3 // Randomly set membership
      });
      
      // Simulate loading messages
      setTimeout(() => {
        const usernames = users.map(u => u.username);
        const messages = [];
        
        // Generate 5-10 random messages
        const msgCount = Math.floor(Math.random() * 6) + 5;
        for (let i = 0; i < msgCount; i++) {
          const isCurrentUser = Math.random() > 0.7;
          const senderIndex = Math.floor(Math.random() * users.length);
          
          messages.push({
            id: `g-${group._id}-${i}`,
            content: `This is a message in the ${group.name} group. ${isCurrentUser ? "How can I help?" : "Welcome!"}`,
            sender: {
              username: isCurrentUser ? authUser.username : users[senderIndex].username,
              _id: isCurrentUser ? authUser._id : users[senderIndex]._id
            },
            createdAt: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            isCurrentUser
          });
        }
        
        useChatStore.setState({ messages });
      }, 500);
      
      // Switch to chat tab on mobile
      if (isMobile) {
        setTabIndex(0);
      }
    } catch (error) {
      toast({
        title: "Error loading group",
        description: error.message || "Could not load group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleGeneralChatSelect = () => {
    clearCurrentGroup();
    useChatStore.setState({ messages: getLocalMessages() });
  };

  const renderHeader = () => (
    <Box p={4} borderBottom="1px solid" borderColor="gray.200">
      <Heading size="md" color="teal.600">Community Chat</Heading>
      <Text fontSize="sm" color="gray.500" mt={1}>
        {currentGroup ? `Group: ${currentGroup.name}` : 'Connect with students & teachers'}
      </Text>
    </Box>
  );

  const renderChatInfo = () => (
    <>
      <Divider />
      <Box p={4}>
        <Text fontWeight="medium" color="gray.700" mb={2}>
          Chat Guidelines
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Be respectful to others
        </Text>
        <Text fontSize="sm" color="gray.600">
          • No spamming or harassment
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Keep discussions relevant
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Protect your personal information
        </Text>
      </Box>
      <Divider />
      <Box p={4}>
        <Text fontWeight="medium" color="gray.700" mb={2}>
          About {currentGroup ? currentGroup.name : 'Community Chat'}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {currentGroup ? currentGroup.description : 
            'This is a real-time chat platform for EduConnect users to collaborate, share resources, and build connections with peers.'}
        </Text>
        {currentGroup && (
          <Text fontSize="sm" color="gray.600" mt={2}>
            Created by: {currentGroup.createdBy?.username || 'Unknown'}
          </Text>
        )}
      </Box>
    </>
  );

  return (
    <Box h="calc(100vh - 60px)" position="relative">
      <Flex h="full">
        {/* Sidebar for larger screens */}
        {!isMobile && (
          <Box w="260px" borderRight="1px solid" borderColor="gray.200">
            {renderHeader()}
            {renderChatInfo()}
            
            {/* "Return to General Chat" button when in a group */}
            {currentGroup && (
              <Box p={4}>
                <Flex
                  p={2}
                  bg="blue.50"
                  borderRadius="md"
                  align="center"
                  cursor="pointer"
                  onClick={handleGeneralChatSelect}
                  _hover={{ bg: "blue.100" }}
                >
                  <Icon as={FiMessageCircle} mr={2} color="blue.500" />
                  <Text fontSize="sm" fontWeight="medium" color="blue.700">
                    Return to General Chat
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>
        )}

        {/* Main Chat Area */}
        <Box flex="1" position="relative">
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              aria-label="Open sidebar"
              position="absolute"
              top={4}
              left={4}
              zIndex={2}
              onClick={onOpen}
              colorScheme="teal"
              variant="ghost"
            />
          )}

          {/* Chat Content */}
          <Flex direction="column" h="full">
            <ChatArea />
          </Flex>
        </Box>

        {/* Right sidebar with tabs - always visible on desktop */}
        {!isMobile && (
          <Box w="260px" h="full">
            <Tabs variant="soft-rounded" colorScheme="blue" h="full" display="flex" flexDirection="column">
              <TabList px={4} pt={3} bg="white" borderBottom="1px solid" borderColor="gray.200">
                <Tab><Icon as={FiUsers} mr={2} />Members</Tab>
                <Tab><Icon as={FiLayers} mr={2} />Groups</Tab>
              </TabList>
              <TabPanels flex="1" overflowY="auto">
                <TabPanel p={0} h="full">
                  <UsersList users={currentGroup ? currentGroup.members || users : users} />
                </TabPanel>
                <TabPanel p={0} h="full">
                  <GroupsList onGroupSelect={handleGroupSelect} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Flex>

      {/* Mobile Drawer for Sidebar and Tabs */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {currentGroup ? currentGroup.name : 'Community Chat'}
          </DrawerHeader>
          <DrawerBody p={0}>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="blue" h="full" display="flex" flexDirection="column">
              <TabList px={4} pt={3}>
                <Tab><Icon as={FiMessageCircle} mr={2} />Chat</Tab>
                <Tab><Icon as={FiUsers} mr={2} />Members</Tab>
                <Tab><Icon as={FiLayers} mr={2} />Groups</Tab>
              </TabList>
              <TabPanels flex="1">
                <TabPanel>
                  {/* Chat info for mobile */}
                  {renderChatInfo()}
                  
                  {/* "Return to General Chat" button when in a group */}
                  {currentGroup && (
                    <Box p={4}>
                      <Flex
                        p={2}
                        bg="blue.50"
                        borderRadius="md"
                        align="center"
                        cursor="pointer"
                        onClick={() => {
                          handleGeneralChatSelect();
                          onClose(); // Close drawer after action
                        }}
                        _hover={{ bg: "blue.100" }}
                      >
                        <Icon as={FiMessageCircle} mr={2} color="blue.500" />
                        <Text fontSize="sm" fontWeight="medium" color="blue.700">
                          Return to General Chat
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={0} h="full">
                  <UsersList 
                    users={currentGroup ? currentGroup.members || users : users} 
                  />
                </TabPanel>
                <TabPanel p={0} h="full">
                  <GroupsList 
                    onGroupSelect={(group) => {
                      handleGroupSelect(group);
                      onClose(); // Close drawer after selection
                    }} 
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CommunityChat; 