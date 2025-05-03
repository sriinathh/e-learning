import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Heading, 
  Container, 
  useToast, 
  useDisclosure,
  Button,
  Icon
} from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';
import CommunityHeader from '../components/community/CommunityHeader';
import GroupListSimple from '../components/community/GroupListSimple';
import ChatArea from '../components/community/ChatArea';
import MembersList from '../components/community/MembersList';
import GroupModal from '../components/community/GroupModal';

const MainCommunityPage = () => {
  const toast = useToast();
  
  // Current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          id: userData._id || userData.id || '123',
          name: userData.name || 'User',
          email: userData.email || 'user@example.com',
          avatar: userData.profilePicture || userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'User')}`,
          role: userData.role || 'student',
          hasCustomAvatar: !!userData.profilePicture
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return {
      id: '123',
      name: 'Current User',
      email: 'user@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
      role: 'student',
      hasCustomAvatar: false
    };
  });
  
  // Sample groups data
  const [groups, setGroups] = useState([
    {
      _id: '1',
      name: 'General Chat',
      description: 'Main channel for campus-wide discussions',
      avatar: null,
      color: 'blue',
      isPrivate: false,
      memberCount: 156,
      activeUsers: 23,
      lastMessage: 'Welcome to the general chat!',
      unreadCount: 3,
      isMember: true,
      isPinned: true,
      createdBy: {
        _id: 'admin1',
        name: 'Admin User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser'
      },
      members: [
        {
          _id: '123',
          name: 'Current User',
          avatar: currentUser.avatar,
          isOnline: true,
          isAdmin: false,
          isCreator: false
        },
        {
          _id: 'admin1',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
          isOnline: true,
          isAdmin: true,
          isCreator: true
        }
      ]
    },
    {
      _id: '2',
      name: 'Computer Science',
      description: 'Discussions for Computer Science students and faculty',
      avatar: null,
      color: 'purple',
      isPrivate: false,
      memberCount: 87,
      activeUsers: 12,
      lastMessage: 'Anyone know when the next hackathon is?',
      unreadCount: 0,
      isMember: true,
      isPinned: false,
      members: [
        {
          _id: '123',
          name: 'Current User',
          avatar: currentUser.avatar,
          isOnline: true,
          isAdmin: false,
          isCreator: false
        }
      ]
    },
    {
      _id: '3',
      name: 'Business Administration',
      description: 'For business students to network and share resources',
      avatar: null,
      color: 'green',
      isPrivate: false,
      memberCount: 64,
      activeUsers: 8,
      isMember: false,
      isNew: true,
      members: []
    }
  ]);
  
  // All users for the members list
  const [allUsers, setAllUsers] = useState([
    {
      _id: '123',
      name: 'Current User',
      avatar: currentUser.avatar,
      isOnline: true
    },
    {
      _id: 'admin1',
      name: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
      isOnline: true
    },
    {
      _id: 'user2',
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJohnson',
      isOnline: true
    },
    {
      _id: 'user3',
      name: 'Michael Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBrown',
      isOnline: false
    }
  ]);
  
  // Sample messages for the selected group
  const [messages, setMessages] = useState([]);
  
  // Currently selected group
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const { isOpen: isGroupModalOpen, onOpen: onGroupModalOpen, onClose: onGroupModalClose } = useDisclosure();
  const [showMembersList, setShowMembersList] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false,
    icon: null,
    tags: ''
  });
  
  const toggleMembersList = () => {
    setShowMembersList(!showMembersList);
  };
  
  useEffect(() => {
    // Select the first group by default
    if (groups.length > 0 && !selectedGroup) {
      handleSelectGroup(groups[0]);
    }
    
    // Simulate users going online/offline randomly
    const interval = setInterval(() => {
      setAllUsers(prevUsers => 
        prevUsers.map(user => {
          // Current user is always online
          if (user._id === currentUser.id) return user;
          
          // Randomly change online status (20% chance)
          if (Math.random() < 0.2) {
            return { ...user, isOnline: !user.isOnline };
          }
          
          return user;
        })
      );
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [groups, selectedGroup, currentUser.id]);
  
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    
    // Generate mock messages for the group
    const mockMessages = Array.from({ length: 10 }, (_, i) => {
      const isUser = Math.random() > 0.7;
      const sender = isUser 
        ? currentUser 
        : group.members.length > 0 ? group.members[Math.floor(Math.random() * group.members.length)] : {
            _id: 'admin1',
            name: 'Admin User',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser'
          };
      
      return {
        _id: `msg_${Date.now()}_${i}`,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar
        },
        content: generateMessageContent(group.name, i),
        timestamp: new Date(Date.now() - (10 - i) * 600000),
        reactions: []
      };
    });
    
    setMessages(mockMessages);
  };
  
  const handleJoinGroup = (groupId) => {
    setGroups(prevGroups => 
      prevGroups.map(g => {
        if (g._id === groupId) {
          // Add current user to group members
          const updatedMembers = [...g.members, {
            _id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            isOnline: true,
            isAdmin: false,
            isCreator: false
          }];
          
          return { 
            ...g, 
            members: updatedMembers,
            isMember: true,
            memberCount: g.memberCount + 1
          };
        }
        return g;
      })
    );
    
    toast({
      title: "Group joined",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleLeaveGroup = (groupId) => {
    setGroups(prevGroups => 
      prevGroups.map(g => {
        if (g._id === groupId) {
          // Remove current user from members
          const updatedMembers = g.members.filter(m => m._id !== currentUser.id);
          
          return { 
            ...g, 
            members: updatedMembers,
            isMember: false,
            memberCount: g.memberCount - 1
          };
        }
        return g;
      })
    );
    
    // If we're leaving the currently selected group, deselect it
    if (selectedGroup && selectedGroup._id === groupId) {
      setSelectedGroup(null);
      setMessages([]);
    }
    
    toast({
      title: "Left group",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleSendMessage = (messageData) => {
    const newMessage = {
      _id: `msg_${Date.now()}`,
      content: messageData.text,
      sender: {
        _id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      timestamp: new Date(),
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // If this is a new message for a group with unread messages, clear the count
    if (selectedGroup && selectedGroup.unreadCount > 0) {
      setGroups(prevGroups => 
        prevGroups.map(g => 
          g._id === selectedGroup._id ? { ...g, unreadCount: 0 } : g
        )
      );
    }
  };
  
  // Helper function to generate realistic message content
  const generateMessageContent = (groupName, index) => {
    const messages = [
      `Hey everyone! Welcome to the ${groupName} group.`,
      `Has anyone started the project yet?`,
      `I'm working on the assignment due next week. Anyone want to collaborate?`,
      `What did everyone think about today's lecture?`,
      `Is the library open late tonight?`,
      `Can someone share the notes from yesterday's class?`,
      `When is the next study group meeting?`,
      `I found a great resource for our research project: https://example.com/resource`,
      `Who's planning to attend the campus event this weekend?`,
      `Does anyone have Professor Johnson's office hours?`
    ];
    
    return messages[index % messages.length];
  };
  
  // Add this function to handle creating a new group
  const handleCreateGroup = (groupData) => {
    // Generate a unique ID for the new group
    const newGroupId = `group_${Date.now()}`;
    
    // Create a new group object
    const createdGroup = {
      _id: newGroupId,
      name: groupData.name,
      description: groupData.description,
      avatar: groupData.icon,
      color: 'purple', // Default color
      isPrivate: groupData.isPrivate,
      memberCount: 1,
      activeUsers: 1,
      isMember: true,
      isNew: true,
      createdBy: {
        _id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      members: [
        {
          _id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isOnline: true,
          isAdmin: true,
          isCreator: true
        }
      ]
    };
    
    // Add the new group to the groups list
    setGroups(prevGroups => [createdGroup, ...prevGroups]);
    
    // Select the newly created group
    handleSelectGroup(createdGroup);
    
    // Show success message
    toast({
      title: "Group created",
      description: `"${groupData.name}" has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Container maxW="container.xl" p={0}>
      <Box mb={4} pt={4} px={4}>
        <Heading as="h1" size="xl" color="purple.600">Community</Heading>
        <Text color="gray.600">Connect with peers, join groups, and collaborate</Text>
      </Box>
      
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        overflow="hidden"
        h="75vh"
      >
        <CommunityHeader 
          selectedGroup={selectedGroup} 
          showMembersList={showMembersList}
          toggleMembersList={toggleMembersList}
        />
        
        <Flex h="calc(100% - 64px)" overflow="hidden">
          <GroupListSimple 
            groups={groups} 
            selectedGroup={selectedGroup} 
            onSelectGroup={handleSelectGroup}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
            currentUser={currentUser}
            onGroupModalOpen={onGroupModalOpen}
          />
          
          {selectedGroup ? (
            <ChatArea 
              key={selectedGroup._id}
              group={selectedGroup}
              messages={messages} 
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
              onLeaveGroup={handleLeaveGroup}
            />
          ) : (
            <Flex 
              flex="1" 
              direction="column" 
              align="center" 
              justify="center" 
              p={8}
              bg="white"
            >
              <Icon as={FiUsers} boxSize="80px" color="gray.400" mb={6} />
              <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={3}>
                Select a group to start chatting
              </Text>
              <Text color="gray.500" textAlign="center" maxW="500px" fontSize="lg" mb={6}>
                Join or create a group from the left sidebar to connect with your peers and faculty
              </Text>
              <Button 
                mt={6} 
                colorScheme="purple" 
                leftIcon={<FiUsers />}
                size="lg"
                fontSize="md"
                py={6}
                px={8}
                onClick={onGroupModalOpen}
              >
                Create New Group
              </Button>
            </Flex>
          )}
          
          {showMembersList && selectedGroup && (
            <MembersList 
              group={selectedGroup} 
              currentUser={currentUser}
              allUsers={allUsers}
            />
          )}
        </Flex>
      </Box>
      
      {/* Render the GroupModal with the correct props */}
      <GroupModal 
        isOpen={isGroupModalOpen} 
        onClose={onGroupModalClose}
        currentUser={currentUser}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        handleCreateGroup={handleCreateGroup}
      />
    </Container>
  );
};

export default MainCommunityPage; 