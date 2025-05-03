import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  useColorModeValue,
  useDisclosure,
  useToast,
  useClipboard,
  VStack,
  Text,
  Icon,
  Button,
  Badge,
  Avatar,
  HStack,
  Image
} from '@chakra-ui/react';
import { 
  FiMessageCircle, 
  FiUserPlus,
  FiUsers,
  FiVideo,
  FiFile
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import CommunityHeader from '../components/community/CommunityHeader';
import MessageInputBar from '../components/community/MessageInputBar';
import Message, { DateSeparator } from '../components/community/Message';
import GroupList from '../components/community/GroupList';
import GroupModal from '../components/community/GroupModal';

const Community = () => {
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const groupIconInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const { hasCopied, onCopy } = useClipboard("");
  
  // Get current user from localStorage
  const currentUser = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          id: userData._id || userData.id || 'user1',
          name: userData.name || 'User',
          email: userData.email || 'user@example.com',
          avatar: userData.profilePicture || userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'User')}`
        };
      }
      return { id: 'user1', name: 'Guest User', email: 'guest@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuestUser' };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { id: 'user1', name: 'Guest User', email: 'guest@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuestUser' };
    }
  }, []);
  
  // Group management
  const [groups, setGroups] = useState([
    { 
      id: 'general', 
      name: 'General Chat', 
      description: 'Campus-wide discussions', 
      members: ['user1', 'user2', 'user3'],
      color: 'blue',
      isPrivate: false,
      createdBy: 'admin',
      createdAt: '2023-01-01'
    },
    { 
      id: 'cs101', 
      name: 'Computer Science', 
      description: 'CS discussions and help', 
      members: ['user1', 'user4'],
      color: 'purple',
      isPrivate: false,
      createdBy: 'user4',
      createdAt: '2023-02-15'
    },
    { 
      id: 'events', 
      name: 'Campus Events', 
      description: 'Upcoming events and activities', 
      members: ['user1', 'user5'],
      color: 'green',
      isPrivate: false,
      createdBy: 'user5',
      createdAt: '2023-03-10'
    }
  ]);
  
  // Active users with actual profiles
  const [activeUsers, setActiveUsers] = useState([]);
  
  // Load active users when component mounts
  useEffect(() => {
    setActiveUsers(fetchUsers());
    
    // Simulate users going online/offline at intervals
    const interval = setInterval(() => {
      setActiveUsers(prev => 
        prev.map(user => {
          // Current user is always online
          if (user.id === currentUser.id) return {...user, isOnline: true};
          
          // 20% chance to change online status for others
          if (Math.random() < 0.2) {
            return { 
              ...user, 
              isOnline: !user.isOnline,
              lastActive: user.isOnline ? 'just now' : user.lastActive
            };
          }
          return user;
        })
      );
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentUser.id]);
  
  // Messages
  const [messages, setMessages] = useState({
    'general': [
      { id: 1, text: 'Welcome to the General Chat!', sender: 'admin', timestamp: '10:00 AM', senderName: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', date: '2023-10-10' },
      { id: 2, text: 'Hi everyone, how are you today?', sender: 'user2', timestamp: '10:05 AM', senderName: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', date: '2023-10-10' },
      { id: 3, text: 'I\'m good, thanks for asking!', sender: 'user3', timestamp: '10:07 AM', senderName: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', date: '2023-10-11' }
    ],
    'cs101': [
      { id: 1, text: 'Anyone working on the algorithm assignment?', sender: 'user4', timestamp: '11:30 AM', senderName: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', date: '2023-10-10' }
    ],
    'events': [
      { id: 1, text: 'The campus festival is next week!', sender: 'user5', timestamp: '09:15 AM', senderName: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', date: '2023-10-10' }
    ]
  });
  
  // Current selections
  const [currentGroup, setCurrentGroup] = useState(groups[0]);
  const [messageInput, setMessageInput] = useState('');
  
  // Modal states
  const { 
    isOpen: isCreateGroupOpen, 
    onOpen: onCreateGroupOpen, 
    onClose: onCreateGroupClose 
  } = useDisclosure();
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: '',
    icon: null
  });
  
  // File attachment state
  const [attachments, setAttachments] = useState([]);
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentGroup]);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Maximum 5 files at a time
    if (attachments.length + files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can only attach up to 5 files per message",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    
    // Maximum file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    files.forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit`,
          status: "error",
          duration: 3000,
        });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newAttachment = {
          id: Date.now() + Math.random().toString(36).substring(2),
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result
        };
        
        setAttachments(prev => [...prev, newAttachment]);
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove an attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };
  
  // Enhanced send message function with attachment support
  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: currentUser.id,
      senderName: currentUser.name,
      avatar: currentUser.avatar,
      attachments: [...attachments],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    
    setMessages(prevMessages => ({
      ...prevMessages,
      [currentGroup.id]: [...(prevMessages[currentGroup.id] || []), newMessage]
    }));
    
    setMessageInput('');
    setAttachments([]);
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Render attachment preview
  const renderAttachmentPreview = (attachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <Image 
          src={attachment.url} 
          alt={attachment.name}
          objectFit="cover"
          boxSize="100%"
        />
      );
    }
    
    if (attachment.type.startsWith('video/')) {
      return <Icon as={FiVideo} boxSize="40px" color="blue.500" />;
    }
    
    return <Icon as={FiFile} boxSize="40px" color="blue.500" />;
  };

  // Handle group icon selection
  const handleGroupIconSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Group icon must be less than 2MB",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewGroup(prev => ({...prev, icon: reader.result}));
    };
    reader.readAsDataURL(file);
  };

  // Enhanced create group function with icon support
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Group name required",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    const groupId = newGroup.name.toLowerCase().replace(/\s+/g, '-');
    
    const createdGroup = {
      id: groupId,
      name: newGroup.name,
      description: newGroup.description,
      members: [currentUser.id],
      color: ['blue', 'green', 'purple', 'red', 'orange', 'teal'][Math.floor(Math.random() * 6)],
      isPrivate: newGroup.isPrivate,
      icon: newGroup.icon,
      tags: newGroup.tags ? newGroup.tags.split(',').map(tag => tag.trim()) : [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setGroups(prev => [...prev, createdGroup]);
    setMessages(prev => ({
      ...prev,
      [groupId]: []
    }));
    
    // Reset form and close modal
    setNewGroup({
      name: '',
      description: '',
      isPrivate: false,
      tags: '',
      icon: null
    });
    
    onCreateGroupClose();
    
    // Switch to the new group
    setCurrentGroup(createdGroup);
    
    toast({
      title: "Group created",
      description: `${newGroup.name} has been created successfully`,
      status: "success",
      duration: 3000,
    });
  };
  
  // Handle joining a group
  const handleJoinGroup = (group) => {
    if (group.members.includes(currentUser.id)) return;
    
    setGroups(prev => 
      prev.map(g => 
        g.id === group.id 
          ? { ...g, members: [...g.members, currentUser.id] }
          : g
      )
    );
    
    toast({
      title: "Group joined",
      description: `You've joined ${group.name}`,
      status: "success",
      duration: 3000,
    });
  };
  
  // Handle leaving a group
  const handleLeaveGroup = (group) => {
    if (!group.members.includes(currentUser.id)) return;
    
    setGroups(prev => 
      prev.map(g => 
        g.id === group.id 
          ? { ...g, members: g.members.filter(id => id !== currentUser.id) }
          : g
      )
    );
    
    // If current group is left, switch to General
    if (currentGroup.id === group.id) {
      const generalGroup = groups.find(g => g.id === 'general');
      if (generalGroup) setCurrentGroup(generalGroup);
    }
    
    toast({
      title: "Group left",
      description: `You've left ${group.name}`,
      status: "info",
      duration: 3000,
    });
  };
  
  // Switch to a group
  const switchToGroup = (group) => {
    setCurrentGroup(group);
  };

  // Function to fetch users from localStorage or API
  const fetchUsers = () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate some users from localStorage
      const storedUsers = [];
      
      // Add current user first
      storedUsers.push({
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isOnline: true,
        email: currentUser.email || 'user@example.com',
        lastActive: 'now'
      });
      
      // Get user data from localStorage if available
      const localUserData = localStorage.getItem('allUsers');
      if (localUserData) {
        try {
          const parsedUsers = JSON.parse(localUserData);
          if (Array.isArray(parsedUsers)) {
            parsedUsers.forEach(user => {
              if (user.id !== currentUser.id) {
                storedUsers.push({
                  ...user,
                  isOnline: Math.random() > 0.5 // Random online status for demo
                });
              }
            });
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // If no other users were found, add some sample users
      if (storedUsers.length <= 1) {
        const sampleUsers = [
          { id: 'user2', name: 'Sarah', email: 'sarah@example.com', lastActive: '5m ago' },
          { id: 'user3', name: 'Mike', email: 'mike@example.com', lastActive: '10m ago' },
          { id: 'user4', name: 'Alex', email: 'alex@example.com', lastActive: '1h ago' },
          { id: 'user5', name: 'Emma', email: 'emma@example.com', lastActive: '3h ago' }
        ];
        
        sampleUsers.forEach(user => {
          storedUsers.push({
            ...user,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
            isOnline: Math.random() > 0.5
          });
        });
      }
      
      return storedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Handle starting a direct message
  const startDirectMessage = (userId) => {
    // Find the user
    const user = activeUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Check if a direct message group already exists
    const dmGroupId = `dm-${[currentUser.id, userId].sort().join('-')}`;
    let dmGroup = groups.find(g => g.id === dmGroupId);
    
    if (!dmGroup) {
      // Create a new DM group
      dmGroup = {
        id: dmGroupId,
        name: `Chat with ${user.name}`,
        description: 'Direct messages',
        members: [currentUser.id, userId],
        color: 'purple',
        isPrivate: true,
        isDM: true,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Add the group to the groups list
      setGroups(prev => [...prev, dmGroup]);
      
      // Initialize empty messages array
      setMessages(prev => ({
        ...prev,
        [dmGroupId]: []
      }));
      
      toast({
        title: "Direct message started",
        description: `You can now chat with ${user.name}`,
        status: "success",
        duration: 3000,
      });
    }
    
    // Switch to the DM group
    setCurrentGroup(dmGroup);
    setActiveTab(0); // Switch to Groups tab
  };

  // Render the chat header
  const renderChatHeader = () => {
    if (currentGroup.isDM) {
      // Direct message header
      const otherUserId = currentGroup.members.find(id => id !== currentUser.id);
      const otherUser = activeUsers.find(u => u.id === otherUserId) || { 
        name: "User", 
        isOnline: false 
      };
      
      return (
        <Flex 
          px={6} 
          py={3} 
          bg={bgColor} 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          align="center"
        >
          <Box position="relative">
            <Avatar 
              size="sm" 
              name={otherUser.name} 
              src={otherUser.avatar}
              mr={3}
            />
            <Box 
              position="absolute" 
              bottom="0" 
              right="3px" 
              w="10px" 
              h="10px" 
              borderRadius="full" 
              bg={otherUser.isOnline ? "green.400" : "gray.400"}
              borderWidth="1.5px"
              borderColor={bgColor}
            />
          </Box>
          
          <Box flex="1">
            <Text fontWeight="bold">{otherUser.name}</Text>
            <Text fontSize="xs" color="gray.500">
              {otherUser.isOnline ? "Online" : otherUser.lastActive || "Offline"}
            </Text>
          </Box>
        </Flex>
      );
    } else {
      // Group chat header
      return (
        <Flex 
          px={6} 
          py={3} 
          bg={bgColor} 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          align="center"
        >
          <Avatar 
            size="sm" 
            name={currentGroup.name} 
            src={currentGroup.icon}
            bg={`${currentGroup.color}.400`}
            color="white"
            mr={3}
          />
          
          <Box flex="1">
            <HStack>
              <Text fontWeight="bold">{currentGroup.name}</Text>
              <Badge colorScheme={currentGroup.isPrivate ? "red" : "green"}>
                {currentGroup.isPrivate ? "Private" : "Public"}
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              {currentGroup.members.length} members • {
                activeUsers.filter(u => 
                  currentGroup.members.includes(u.id) && u.isOnline
                ).length
              } online
            </Text>
          </Box>
        </Flex>
      );
    }
  };

  // Render messages with date separators
  const renderMessages = () => {
    if (!currentGroup.members.includes(currentUser.id)) {
      return (
        <Flex 
          justify="center" 
          align="center" 
          height="100%" 
          direction="column"
        >
          <Button 
            colorScheme="blue" 
            leftIcon={<FiUserPlus />}
            onClick={() => handleJoinGroup(currentGroup)}
            mb={4}
          >
            Join Group
          </Button>
          <Text color="gray.500">
            You need to join this group to view and send messages
          </Text>
        </Flex>
      );
    }
    
    const groupMessages = messages[currentGroup.id] || [];
    
    if (groupMessages.length === 0) {
      return (
        <Flex 
          justify="center" 
          align="center" 
          height="100%" 
          direction="column"
          color="gray.500"
        >
          <Icon as={FiMessageCircle} fontSize="5xl" mb={4} />
          <Text>No messages yet. Start the conversation!</Text>
        </Flex>
      );
    }
    
    return (
      <VStack spacing={3} align="stretch">
        {groupMessages.map((message, idx) => {
          const showDate = idx === 0 || 
            groupMessages[idx-1].date !== message.date;
          
          return (
            <React.Fragment key={message.id}>
              {showDate && message.date && (
                <DateSeparator date={message.date} />
              )}
              <Message 
                message={message} 
                currentUser={currentUser} 
                isNew={false} 
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </VStack>
    );
  };

  return (
    <Box height="calc(100vh - 60px)" overflow="hidden">
      <Flex h="100%" direction="column">
        {/* Header */}
        <CommunityHeader currentUser={currentUser} onCreateGroupOpen={onCreateGroupOpen} />
        
        {/* Main Content */}
        <Flex flex="1" overflow="hidden">
          {/* Sidebar with GroupList */}
          <Box 
            w="280px" 
            bg={bgColor} 
            borderRightWidth="1px" 
            borderColor={borderColor}
            overflowY="auto"
          >
            <GroupList 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              groups={groups}
              currentGroup={currentGroup}
              currentUser={currentUser}
              activeUsers={activeUsers}
              switchToGroup={switchToGroup}
              handleJoinGroup={handleJoinGroup}
              handleLeaveGroup={handleLeaveGroup}
              startDirectMessage={startDirectMessage}
            />
          </Box>
          
          {/* Chat Area */}
          <Flex flex="1" direction="column" bg={useColorModeValue('gray.50', 'gray.900')} overflow="hidden">
            {currentGroup && (
              <>
                {/* Chat Header */}
                {renderChatHeader()}
                
                {/* Messages */}
                <Box 
                  flex="1"
                  overflowY="auto" 
                  px={4} 
                  py={4}
                >
                  {renderMessages()}
                </Box>
                
                {/* Message Input */}
                {currentGroup.members.includes(currentUser.id) && (
                  <MessageInputBar 
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    handleSendMessage={handleSendMessage}
                    fileInputRef={fileInputRef}
                    handleFileSelect={handleFileSelect}
                    attachments={attachments}
                    removeAttachment={removeAttachment}
                    currentGroup={currentGroup}
                    currentUser={currentUser}
                    renderAttachmentPreview={renderAttachmentPreview}
                  />
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      
      {/* Create Group Modal */}
      <GroupModal 
        isOpen={isCreateGroupOpen}
        onClose={onCreateGroupClose}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        handleCreateGroup={handleCreateGroup}
        groupIconInputRef={groupIconInputRef}
        handleGroupIconSelect={handleGroupIconSelect}
      />
    </Box>
  );
};

export default Community; 