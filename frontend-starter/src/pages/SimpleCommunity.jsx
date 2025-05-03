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
  Badge,
  Divider,
  Avatar,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Tag,
  TagLabel,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  useDisclosure,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiPlus, 
  FiRefreshCw, 
  FiSend, 
  FiPaperclip, 
  FiSmile,
  FiMoreVertical,
  FiImage,
  FiFile,
  FiLock,
  FiGlobe,
  FiUserPlus,
  FiUserMinus,
  FiTag,
  FiSettings,
  FiLogOut,
  FiCamera,
  FiCheck,
  FiEdit,
  FiUpload,
  FiSave,
  FiXCircle
} from 'react-icons/fi';

// Define theme colors
const THEME = {
  primary: "teal.500",
  secondary: "purple.500",
  accent: "orange.400",
  success: "green.500",
  warning: "yellow.500",
  danger: "red.500",
  light: "gray.100",
  dark: "gray.800",
  bg: {
    light: "white",
    dark: "gray.800"
  },
  gradient: "linear-gradient(to right, #00b09b, #96c93d)"
};

// Mock data for communities
const MOCK_COMMUNITIES = [
  {
    _id: '1',
    name: 'Engineering Campus',
    description: 'Connect with engineering students and faculty across departments',
    createdBy: { _id: '123', name: 'John Doe', profilePicture: 'https://bit.ly/dan-abramov' },
    members: [
      {user: '123', name: 'John Doe', role: 'admin', profilePicture: 'https://bit.ly/dan-abramov', isOnline: true},
      {user: '124', name: 'Jane Smith', role: 'member', profilePicture: 'https://bit.ly/code-beast', isOnline: true},
      {user: '125', name: 'Bob Johnson', role: 'member', profilePicture: 'https://bit.ly/ryan-florence', isOnline: false}
    ],
    tags: ['Engineering', 'Technology', 'Innovation'],
    isPublic: true,
    avatar: 'https://bit.ly/3L1B6pJ',
    activeMembers: 2
  },
  {
    _id: '2',
    name: 'Science Campus',
    description: 'Discuss scientific research, experiments, and academic opportunities',
    createdBy: { _id: '125', name: 'Bob Johnson', profilePicture: 'https://bit.ly/ryan-florence' },
    members: [
      {user: '125', name: 'Bob Johnson', role: 'admin', profilePicture: 'https://bit.ly/ryan-florence', isOnline: false},
      {user: '126', name: 'Alice Williams', role: 'moderator', profilePicture: 'https://bit.ly/kent-c-dodds', isOnline: true}
    ],
    tags: ['Research', 'Science', 'Discovery', 'Labs'],
    isPublic: true,
    avatar: 'https://bit.ly/3c4jDrt',
    activeMembers: 1
  },
  {
    _id: '3',
    name: 'Business School',
    description: 'Network with future entrepreneurs and business leaders',
    createdBy: { _id: '126', name: 'Alice Williams', profilePicture: 'https://bit.ly/kent-c-dodds' },
    members: [
      {user: '126', name: 'Alice Williams', role: 'admin', profilePicture: 'https://bit.ly/kent-c-dodds', isOnline: true},
      {user: '127', name: 'Charlie Brown', role: 'member', profilePicture: 'https://bit.ly/sage-adebayo', isOnline: false}
    ],
    tags: ['Business', 'Entrepreneurship', 'Finance', 'Marketing'],
    isPublic: false,
    avatar: 'https://bit.ly/3Ofgf0u',
    activeMembers: 1
  },
  {
    _id: '4',
    name: 'Arts & Design Campus',
    description: 'Creative community for artists, designers, and performers',
    createdBy: { _id: '124', name: 'Jane Smith', profilePicture: 'https://bit.ly/code-beast' },
    members: [
      {user: '124', name: 'Jane Smith', role: 'admin', profilePicture: 'https://bit.ly/code-beast', isOnline: true}
    ],
    tags: ['Art', 'Design', 'Creativity', 'Performance'],
    isPublic: true,
    avatar: 'https://bit.ly/3GKZJbN',
    activeMembers: 1
  },
  {
    _id: '5',
    name: 'Medical Campus',
    description: 'For medical students, researchers, and healthcare professionals',
    createdBy: { _id: '127', name: 'Charlie Brown', profilePicture: 'https://bit.ly/sage-adebayo' },
    members: [
      {user: '127', name: 'Charlie Brown', role: 'admin', profilePicture: 'https://bit.ly/sage-adebayo', isOnline: false}
    ],
    tags: ['Medicine', 'Health', 'Research', 'Patient Care'],
    isPublic: true,
    avatar: 'https://bit.ly/3GJOTRS',
    activeMembers: 0
  }
];

// Mock active users
const MOCK_USERS = [
  { _id: '123', name: 'John Doe', isOnline: true, profilePicture: 'https://bit.ly/dan-abramov', lastActive: new Date() },
  { _id: '124', name: 'Jane Smith', isOnline: true, profilePicture: 'https://bit.ly/code-beast', lastActive: new Date() },
  { _id: '125', name: 'Bob Johnson', isOnline: false, profilePicture: 'https://bit.ly/ryan-florence', lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { _id: '126', name: 'Alice Williams', isOnline: true, profilePicture: 'https://bit.ly/kent-c-dodds', lastActive: new Date() },
  { _id: '127', name: 'Charlie Brown', isOnline: false, profilePicture: 'https://bit.ly/sage-adebayo', lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000) },
];

// Mock messages for each community
const MOCK_COMMUNITY_MESSAGES = {
  '1': [
    {
      _id: 'm1',
      content: 'Hello everyone! Welcome to the Web Development community!',
      sender: { _id: '123', name: 'John Doe', profilePicture: 'https://bit.ly/dan-abramov' },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isCurrentUser: false
    },
    {
      _id: 'm2',
      content: 'Thanks for creating this community! I\'m excited to learn and share.',
      sender: { _id: '124', name: 'Jane Smith', profilePicture: 'https://bit.ly/code-beast' },
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
      isCurrentUser: false
    },
    {
      _id: 'm3',
      content: 'What topics should we focus on first? I\'m personally interested in React and Next.js.',
      sender: { _id: '123', name: 'John Doe', profilePicture: 'https://bit.ly/dan-abramov' },
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
      isCurrentUser: false
    },
    {
      _id: 'm4',
      content: 'Next.js is a great framework! I\'ve been using it for a while now.',
      sender: { _id: '125', name: 'Bob Johnson', profilePicture: 'https://bit.ly/ryan-florence' },
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
      isCurrentUser: false,
      attachments: [
        {
          type: 'image',
          url: 'https://bit.ly/3L3xJtT',
          name: 'nextjs-dashboard.png'
        }
      ]
    }
  ],
  '2': [
    {
      _id: 'm5',
      content: 'Welcome to the Data Science community! Anyone working on interesting ML projects?',
      sender: { _id: '125', name: 'Bob Johnson', profilePicture: 'https://bit.ly/ryan-florence' },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      isCurrentUser: false
    },
    {
      _id: 'm6',
      content: 'I\'m working on a computer vision project using TensorFlow!',
      sender: { _id: '126', name: 'Alice Williams', profilePicture: 'https://bit.ly/kent-c-dodds' },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      isCurrentUser: false
    }
  ],
  '3': [
    {
      _id: 'm7',
      content: 'This is a private community for mobile developers. Let\'s discuss the latest trends!',
      sender: { _id: '126', name: 'Alice Williams', profilePicture: 'https://bit.ly/kent-c-dodds' },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isCurrentUser: false
    }
  ],
  '4': [
    {
      _id: 'm8',
      content: 'Welcome UI/UX designers! Share your latest designs and get feedback.',
      sender: { _id: '124', name: 'Jane Smith', profilePicture: 'https://bit.ly/code-beast' },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      isCurrentUser: false,
      attachments: [
        {
          type: 'image',
          url: 'https://bit.ly/3OKfDA4',
          name: 'ui-design.png'
        }
      ]
    }
  ],
  '5': [
    {
      _id: 'm9',
      content: 'Cloud experts, what\'s your take on serverless architecture?',
      sender: { _id: '127', name: 'Charlie Brown', profilePicture: 'https://bit.ly/sage-adebayo' },
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      isCurrentUser: false
    }
  ]
};

// Simple Community Page
const SimpleCommunity = () => {
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Get colors based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue(THEME.primary, 'gray.700');
  const headerColor = useColorModeValue('white', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const selectedBg = useColorModeValue('teal.50', 'teal.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Get current user from localStorage, or use default
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return { 
          _id: user._id || 'guest-user',
          name: user.name || 'Guest User',
          profilePicture: user.profilePicture || user.avatar || 'https://bit.ly/dan-abramov',
          isOnline: true
        };
      }
      return { _id: 'guest-user', name: 'Guest User', profilePicture: 'https://bit.ly/dan-abramov', isOnline: true };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { _id: 'guest-user', name: 'Guest User', profilePicture: 'https://bit.ly/dan-abramov', isOnline: true };
    }
  });
  
  // States
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(() => {
    try {
      // Start with the current user
      const user = currentUser;
      
      // Add only a few selected mock users to simulate other active users
      return [
        user,
        { _id: 'user1', name: 'Jane Smith', isOnline: true, profilePicture: 'https://bit.ly/code-beast', lastActive: new Date() },
        { _id: 'user2', name: 'Alice Williams', isOnline: true, profilePicture: 'https://bit.ly/kent-c-dodds', lastActive: new Date() },
      ];
    } catch (error) {
      console.error('Error setting up active users:', error);
      return [currentUser];
    }
  });
  const [userMemberships, setUserMemberships] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  
  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  
  // Additional states
  const [activeChat, setActiveChat] = useState(null); // For direct messaging
  const [directMessages, setDirectMessages] = useState({}); // Store direct messages
  const [currentDirectMessage, setCurrentDirectMessage] = useState(''); // Current direct message input
  
  // Add profile modal state
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const profileImageRef = useRef(null);
  
  // Add a state to track image upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Initialize user memberships by checking which communities user is a member of
  useEffect(() => {
    const memberships = [];
    communities.forEach(community => {
      const isMember = community.members.some(member => member.user === currentUser._id);
      if (isMember) {
        memberships.push(community._id);
      }
    });
    setUserMemberships(memberships);
  }, [communities, currentUser._id]);
  
  // Format timestamp for messages
  const formatMessageTime = (date) => {
    try {
      if (!date) return '';
      const messageDate = new Date(date);
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };
  
  // Format date for messages
  const formatMessageDate = (date) => {
    try {
      if (!date) return '';
      const messageDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return '';
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach(msg => {
      const messageDate = new Date(msg.createdAt);
      const formattedDate = formatMessageDate(msg.createdAt);
      
      // Add date separator if needed
      if (formattedDate !== currentDate) {
        groups.push({
          type: 'date',
          date: formattedDate,
          timestamp: messageDate
        });
        currentDate = formattedDate;
      }
      
      // Add message
      groups.push({
        type: 'message',
        ...msg
      });
    });
    
    return groups;
  };
  
  // Check if user is a member of a community
  const isMember = (communityId) => {
    return userMemberships.includes(communityId);
  };
  
  // Handle selecting a community
  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
    setShowMembers(false);
    
    // Load messages for this community
    const communityMessages = MOCK_COMMUNITY_MESSAGES[community._id] || [];
    
    // Mark messages as current user if they match the current user ID
    const messagesWithCurrentUser = communityMessages.map(msg => ({
      ...msg,
      isCurrentUser: msg.sender._id === currentUser._id
    }));
    
    setMessages(messagesWithCurrentUser);
  };
  
  // Handle joining a community
  const handleJoinCommunity = (communityId) => {
    // Add user to community members
    setCommunities(prevCommunities => 
      prevCommunities.map(community => {
        if (community._id === communityId) {
          return {
            ...community,
            members: [...community.members, {
              user: currentUser._id,
              name: currentUser.name,
              role: 'member',
              profilePicture: currentUser.profilePicture,
              isOnline: true
            }],
            activeMembers: community.activeMembers + 1
          };
        }
        return community;
      })
    );
    
    // Add community to user memberships
    setUserMemberships(prev => [...prev, communityId]);
    
    toast({
      title: "Joined Community",
      description: "You have successfully joined this community",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Handle leaving a community
  const handleLeaveCommunity = (communityId) => {
    // Remove user from community members
    setCommunities(prevCommunities => 
      prevCommunities.map(community => {
        if (community._id === communityId) {
          const updatedMembers = community.members.filter(
            member => member.user !== currentUser._id
          );
          return {
            ...community,
            members: updatedMembers,
            activeMembers: Math.max(0, community.activeMembers - 1)
          };
        }
        return community;
      })
    );
    
    // Remove community from user memberships
    setUserMemberships(prev => prev.filter(id => id !== communityId));
    
    // If currently viewing this community, clear selection
    if (selectedCommunity && selectedCommunity._id === communityId) {
      setSelectedCommunity(null);
      setMessages([]);
    }
    
    toast({
      title: "Left Community",
      description: "You have successfully left this community",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Handle creating a new community
  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your community",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    const newCommunityId = `${communities.length + 1}`;
    const createdCommunity = {
      _id: newCommunityId,
      name: newCommunity.name,
      description: newCommunity.description,
      createdBy: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePicture: currentUser.profilePicture
      },
      members: [{
        user: currentUser._id,
        name: currentUser.name,
        role: 'admin',
        profilePicture: currentUser.profilePicture,
        isOnline: true
      }],
      tags: newCommunity.tags,
      isPublic: newCommunity.isPublic,
      avatar: `https://picsum.photos/seed/${newCommunity.name}/300/300`,
      activeMembers: 1
    };
    
    // Add to communities list
    setCommunities(prev => [...prev, createdCommunity]);
    
    // Add to user memberships
    setUserMemberships(prev => [...prev, newCommunityId]);
    
    // Initialize empty message list for this community
    MOCK_COMMUNITY_MESSAGES[newCommunityId] = [];
    
    // Reset form
    setNewCommunity({
      name: '',
      description: '',
      isPublic: true,
      tags: []
    });
    
    // Close modal
    onCreateClose();
    
    // Select the new community
    handleSelectCommunity(createdCommunity);
    
    toast({
      title: "Community Created",
      description: `'${newCommunity.name}' community has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle adding a tag to new community
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      // Check if tag already exists
      if (newCommunity.tags.includes(tagInput.trim())) {
        toast({
          title: "Duplicate Tag",
          description: "This tag already exists",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      // Max 5 tags
      if (newCommunity.tags.length >= 5) {
        toast({
          title: "Maximum Tags Reached",
          description: "You can add up to 5 tags",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      setNewCommunity({
        ...newCommunity,
        tags: [...newCommunity.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setNewCommunity({
      ...newCommunity,
      tags: newCommunity.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "You can upload a maximum of 5 files at once",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    // Preview files (in a real app, you would upload these to a server)
    const fileAttachments = files.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        type: isImage ? 'image' : 'file',
        url: isImage ? URL.createObjectURL(file) : '#',
        name: file.name,
        size: file.size
      };
    });
    
    setAttachments(fileAttachments);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    if (!selectedCommunity) return;
    
    const newMessage = {
      _id: `m${Date.now()}`,
      content: message,
      sender: currentUser,
      createdAt: new Date().toISOString(),
      isCurrentUser: true,
      attachments: attachments.length > 0 ? attachments : undefined
    };
    
    // Add to community messages
    if (!MOCK_COMMUNITY_MESSAGES[selectedCommunity._id]) {
      MOCK_COMMUNITY_MESSAGES[selectedCommunity._id] = [];
    }
    MOCK_COMMUNITY_MESSAGES[selectedCommunity._id].push(newMessage);
    
    // Update state
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setAttachments([]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Add this function for handling direct messages
  const handleDirectMessage = (userId) => {
    // Check if there are existing messages with this user
    if (!directMessages[userId]) {
      // Initialize empty message array for this user
      setDirectMessages(prev => ({
        ...prev,
        [userId]: []
      }));
    }
    
    // Set active chat to this user
    const user = activeUsers.find(u => u._id === userId);
    if (user) {
      setActiveChat(user);
      setSelectedCommunity(null);
    } else {
      toast({
        title: "User Not Found",
        description: "The selected user could not be found",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  // Add function to send direct message
  const handleSendDirectMessage = () => {
    if (!currentDirectMessage.trim() && attachments.length === 0) return;
    if (!activeChat) return;
    
    const newMessage = {
      _id: `dm${Date.now()}`,
      content: currentDirectMessage,
      sender: currentUser,
      receiver: activeChat,
      createdAt: new Date().toISOString(),
      isCurrentUser: true,
      attachments: attachments.length > 0 ? attachments : undefined
    };
    
    // Add to direct messages
    setDirectMessages(prev => ({
      ...prev,
      [activeChat._id]: [...(prev[activeChat._id] || []), newMessage]
    }));
    
    // Clear input
    setCurrentDirectMessage('');
    setAttachments([]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle key press for direct messaging
  const handleDirectMessageKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendDirectMessage();
    }
  };
  
  // Add a useEffect to update activeUsers when currentUser changes
  useEffect(() => {
    setActiveUsers(prev => {
      // Find and replace the currentUser in the active users list
      const filteredUsers = prev.filter(user => user._id !== currentUser._id);
      return [currentUser, ...filteredUsers];
    });
  }, [currentUser]);
  
  // Create an enhanced profile picture upload function that works without a backend
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image less than 5MB",
        status: "error", 
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Start upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    // Setup progress tracking (simulated in this case)
    const simulateProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 95) {
          clearInterval(interval);
          progress = 95; // Hold at 95% until complete
        }
        setUploadProgress(Math.min(progress, 95));
      }, 300);
      return interval;
    };
    
    const interval = simulateProgress();
    
    // When the read operation is complete
    reader.onload = (event) => {
      // Get the image data URL
      const imageDataUrl = event.target.result;
      
      // Set preview image
      setPreviewImage(imageDataUrl);
      
      // Finish upload simulation
      clearInterval(interval);
      setUploadProgress(100);
      
      // Finish upload after a short delay to show 100% progress
      setTimeout(() => {
        setIsUploading(false);
        
        // Show success message
        toast({
          title: "Image ready",
          description: "Your profile picture is ready to save",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 500);
    };
    
    // Handle errors
    reader.onerror = () => {
      clearInterval(interval);
      setIsUploading(false);
      
      toast({
        title: "Upload failed",
        description: "There was an error reading the image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  };
  
  // Function to save the profile picture
  const saveProfilePicture = () => {
    if (!previewImage) return;
    
    try {
      // Show loading toast
      const loadingToastId = toast({
        title: "Saving profile picture",
        description: "Please wait...",
        status: "loading",
        duration: null,
        isClosable: false,
      });
      
      // In a real app, this would be an API call
      setTimeout(() => {
        // Update user state
        setCurrentUser(prev => ({
          ...prev,
          profilePicture: previewImage
        }));
        
        // Update localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.profilePicture = previewImage;
          user.avatar = previewImage; // For compatibility
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // Create new user data if it doesn't exist
          const newUser = {
            _id: currentUser._id,
            name: currentUser.name,
            profilePicture: previewImage,
            avatar: previewImage
          };
          localStorage.setItem('user', JSON.stringify(newUser));
        }
        
        // Reset the preview image
        setPreviewImage(null);
        
        // Update active users with new profile pic
        setActiveUsers(prev => {
          return prev.map(user => {
            if (user._id === currentUser._id) {
              return {
                ...user,
                profilePicture: previewImage
              };
            }
            return user;
          });
        });
        
        // Close loading toast
        toast.close(loadingToastId);
        
        // Show success message
        toast({
          title: "Success!",
          description: "Your profile picture has been updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Close the modal
        onProfileClose();
      }, 1500); // Simulate network delay
    } catch (error) {
      console.error("Error saving profile picture:", error);
      toast({
        title: "Save failed",
        description: error.message || "There was an error saving your profile picture",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Function to cancel upload/preview
  const cancelProfilePictureUpload = () => {
    setPreviewImage(null);
    setIsUploading(false);
    setUploadProgress(0);
  };
  
  // Add some custom styles to the bottom of the file
  // Add this style tag at the end of the component before the return statement
  const customStyles = `
    .css-lz7jwb {
      max-height: 100px !important;
      overflow-y: auto !important;
    }
  `;
  
  return (
    <Box p={4} bg={bgColor}>
      {/* Header */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4} 
        p={4} 
        borderRadius="lg" 
        bg={headerBg} 
        color={headerColor}
        boxShadow="md"
        backgroundImage="linear-gradient(to right, teal.600, teal.400)"
      >
        <Flex align="center">
          <Icon as={FiMessageSquare} boxSize={6} mr={2} />
          <Heading size="lg">Campus Communities</Heading>
        </Flex>
        <HStack>
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            onClick={onProfileOpen}
            leftIcon={<Avatar size="xs" src={currentUser.profilePicture} name={currentUser.name} />}
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            {currentUser.name}
          </Button>
          <Button 
            leftIcon={<Icon as={FiPlus} />} 
            colorScheme="whiteAlpha" 
            onClick={onCreateOpen}
            _hover={{ bg: 'whiteAlpha.300' }}
            boxShadow="sm"
            fontWeight="bold"
          >
            Create Community
          </Button>
        </HStack>
      </Flex>
      
      <Grid templateColumns={{ base: "1fr", md: "300px 1fr 250px" }} gap={4}>
        {/* Communities List */}
        <GridItem>
          <Flex direction="column" h="75vh" borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
            <Box p={3} bg={headerBg} color={headerColor} backgroundImage="linear-gradient(to right, teal.600, teal.400)">
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FiUsers} mr={2} />
                  <Text fontWeight="bold">Campus Communities</Text>
                </Flex>
                <Button 
                  size="sm" 
                  variant="outline" 
                  colorScheme="whiteAlpha" 
                  leftIcon={<FiRefreshCw />} 
                  onClick={() => {
                    toast({
                      title: "Communities Refreshed",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                >
                  Refresh
                </Button>
              </Flex>
            </Box>
            <Box flex="1" overflowY="auto" bg={cardBg} borderColor={borderColor} p={2}>
              <VStack align="stretch" spacing={2}>
                {communities.map(community => {
                  const isSelected = selectedCommunity?._id === community._id;
                  const userIsMember = isMember(community._id);
                  
                  return (
                    <Box 
                      key={community._id}
                      p={3}
                      borderRadius="md"
                      borderLeftWidth={isSelected ? "4px" : "0px"}
                      borderColor={isSelected ? "teal.300" : borderColor}
                      bg={isSelected ? selectedBg : cardBg}
                      _hover={{ bg: isSelected ? selectedBg : hoverBg }}
                      cursor="pointer"
                      transition="all 0.2s"
                      onClick={() => {
                        handleSelectCommunity(community);
                        setActiveChat(null);
                      }}
                      boxShadow="sm"
                      borderWidth="1px"
                      position="relative"
                    >
                      {!community.isPublic && (
                        <Box position="absolute" top="3" right="3">
                          <Icon as={FiLock} fontSize="xs" color="gray.500" />
                        </Box>
                      )}
                      
                      <Flex>
                        <Avatar 
                          size="md" 
                          name={community.name.substring(0, 2)} 
                          src={community.avatar}
                          mr={3}
                        />
                        
                        <Box flex="1">
                          <Flex align="center">
                            <Text fontWeight="bold" fontSize="md">
                              {community.name}
                            </Text>
                          </Flex>
                          
                          <Text fontSize="sm" color="gray.600" noOfLines={2} my={1}>
                            {community.description || "No description"}
                          </Text>
                          
                          <Flex justify="space-between" align="center" mt={2}>
                            <HStack>
                              <Badge colorScheme="teal" fontSize="xs" px={2} py={0.5} borderRadius="full">
                                {community.members.length} members
                              </Badge>
                              
                              {community.activeMembers > 0 && (
                                <Badge colorScheme="green" fontSize="xs" px={2} py={0.5} borderRadius="full">
                                  {community.activeMembers} online
                                </Badge>
                              )}
                            </HStack>
                            
                            {!userIsMember ? (
                              <Button
                                size="xs"
                                colorScheme="teal"
                                leftIcon={<Icon as={FiUserPlus} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinCommunity(community._id);
                                }}
                              >
                                Join
                              </Button>
                            ) : (
                              <Icon 
                                as={FiCheck} 
                                color="green.500" 
                                p={1} 
                                bg="green.50" 
                                borderRadius="full"
                              />
                            )}
                          </Flex>
                          
                          {community.tags && community.tags.length > 0 && (
                            <HStack spacing={1} mt={2} flexWrap="wrap">
                              {community.tags.slice(0, 3).map((tag, idx) => (
                                <Tag 
                                  key={idx} 
                                  size="sm" 
                                  colorScheme={
                                    ['teal', 'blue', 'green', 'purple', 'orange'][idx % 5]
                                  }
                                  borderRadius="full"
                                  mt={1}
                                  px={2}
                                  py={0.5}
                                  fontSize="xs"
                                >
                                  <TagLabel>{tag}</TagLabel>
                                </Tag>
                              ))}
                              {community.tags.length > 3 && (
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                  +{community.tags.length - 3} more
                                </Text>
                              )}
                            </HStack>
                          )}
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
            <Box p={3} bg={hoverBg} borderTopWidth="1px" borderColor={borderColor}>
              <Flex align="center" justify="space-between">
                <Text fontSize="sm">
                  <Badge colorScheme="green" mr={1}>
                    {activeUsers.filter(u => u.isOnline).length}
                  </Badge> 
                  users online
                </Text>
                <Text fontSize="sm">
                  <Badge colorScheme="purple" ml={1}>
                    {userMemberships.length}
                  </Badge> 
                  memberships
                </Text>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        
        {/* Chat Area */}
        <GridItem>
          {activeChat ? (
            <Flex direction="column" h="65vh" borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
              {/* Header */}
              <Box p={3} bg={headerBg} color={headerColor} backgroundImage="linear-gradient(to right, teal.600, teal.400)">
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar 
                      size="sm" 
                      name={activeChat.name} 
                      src={activeChat.profilePicture}
                      borderWidth={2}
                      borderColor="white"
                    />
                    <Box>
                      <Text fontWeight="bold">{activeChat.name}</Text>
                      <Flex align="center">
                        <Box 
                          w={2} 
                          h={2} 
                          borderRadius="full" 
                          bg={activeChat.isOnline ? "green.400" : "gray.300"} 
                          mr={1}
                        />
                        <Text fontSize="xs">{activeChat.isOnline ? 'Online' : 'Offline'}</Text>
                      </Flex>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      leftIcon={<Icon as={FiMessageSquare} />}
                      onClick={() => {
                        setActiveChat(null);
                      }}
                    >
                      Back to Communities
                    </Button>
                  </HStack>
                </Flex>
              </Box>
              
              {/* Direct Messages Area */}
              <Box 
                flex="1" 
                overflowY="auto" 
                bg={cardBg}
                p={3}
                maxH="400px"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  },
                }}
              >
                {directMessages[activeChat._id]?.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {directMessages[activeChat._id].map((message, index) => (
                      <Box key={message._id}>
                        <HStack spacing={3} align="flex-start">
                          <Avatar 
                            size="sm" 
                            name={message.sender.name} 
                            src={message.sender.profilePicture}
                            bg={`hsl(${message.sender.name.charCodeAt(0) % 360}, 70%, 75%)`}
                            border="2px solid"
                            borderColor={message.isCurrentUser ? "teal.300" : "gray.200"}
                          />
                          <Box flex="1">
                            <Flex align="baseline">
                              <Text fontWeight="bold" fontSize="sm" color={message.isCurrentUser ? THEME.primary : undefined}>
                                {message.sender.name}
                                {message.isCurrentUser && " (You)"}
                              </Text>
                              <Text fontSize="xs" color="gray.500" ml={2}>
                                {formatMessageTime(message.createdAt)}
                              </Text>
                            </Flex>
                            
                            <Box 
                              mt={1} 
                              p={3} 
                              bg={message.isCurrentUser ? 'teal.50' : 'gray.50'} 
                              borderRadius="md"
                              borderLeftWidth="3px"
                              borderLeftColor={message.isCurrentUser ? 'teal.500' : 'gray.300'}
                              boxShadow="sm"
                              position="relative"
                              _after={{
                                content: '""',
                                position: 'absolute',
                                left: '-10px',
                                top: '10px',
                                width: '0',
                                height: '0',
                                borderTop: '5px solid transparent',
                                borderBottom: '5px solid transparent',
                                borderRight: `10px solid ${message.isCurrentUser ? 'var(--chakra-colors-teal-50)' : 'var(--chakra-colors-gray-50)'}`
                              }}
                            >
                              {message.content && (
                                <Text fontSize="sm">{message.content}</Text>
                              )}
                              
                              {/* Render attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <Flex mt={2} flexWrap="wrap" gap={2}>
                                  {message.attachments.map((attachment, attachIndex) => {
                                    if (attachment.type === 'image') {
                                      return (
                                        <Box 
                                          key={`attach-${attachIndex}`} 
                                          borderWidth={1} 
                                          borderRadius="md"
                                          borderColor={borderColor}
                                          overflow="hidden"
                                          maxW="200px"
                                          boxShadow="sm"
                                          transition="transform 0.3s"
                                          _hover={{ transform: 'scale(1.02)' }}
                                        >
                                          <Image 
                                            src={attachment.url} 
                                            alt={attachment.name || 'Attached image'} 
                                            maxH="150px"
                                            objectFit="cover"
                                          />
                                          <Text fontSize="xs" p={1} bg={hoverBg} noOfLines={1}>
                                            {attachment.name}
                                          </Text>
                                        </Box>
                                      );
                                    } else {
                                      return (
                                        <Flex
                                          key={`attach-${attachIndex}`}
                                          borderWidth={1}
                                          borderRadius="md"
                                          borderColor={borderColor}
                                          p={2}
                                          alignItems="center"
                                          bg={hoverBg}
                                          _hover={{ bg: 'gray.100' }}
                                          cursor="pointer"
                                          transition="all 0.2s"
                                        >
                                          <Icon as={FiFile} mr={2} color="blue.500" />
                                          <Box>
                                            <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                                              {attachment.name}
                                            </Text>
                                            {attachment.size && (
                                              <Text fontSize="xs" color="gray.500">
                                                {formatFileSize(attachment.size)}
                                              </Text>
                                            )}
                                          </Box>
                                        </Flex>
                                      );
                                    }
                                  })}
                                </Flex>
                              )}
                            </Box>
                          </Box>
                        </HStack>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                ) : (
                  <Flex direction="column" justify="center" align="center" h="150px">
                    <Icon as={FiMessageSquare} boxSize={12} color="gray.300" mb={4} />
                    <Text color="gray.500">No messages yet</Text>
                    <Text fontSize="sm" mt={2}>Start a conversation with {activeChat.name}</Text>
                  </Flex>
                )}
              </Box>
              
              {/* Direct Message Input */}
              <Box p={3} bg={hoverBg} borderTopWidth={1} borderColor={borderColor}>
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <Flex mb={2} overflowX="auto" gap={2} pb={2}>
                    {attachments.map((file, index) => (
                      <Flex 
                        key={`preview-${index}`}
                        align="center"
                        borderWidth={1}
                        borderRadius="md"
                        p={2}
                        bg="white"
                        borderColor="teal.200"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "md", borderColor: "teal.300" }}
                      >
                        <Icon 
                          as={file.type === 'image' ? FiImage : FiFile} 
                          mr={2}
                          color="teal.500"
                          boxSize={5}
                        />
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1} maxW="150px">
                          {file.name}
                        </Text>
                        <IconButton
                          icon={<Icon as={FiMoreVertical} />}
                          size="xs"
                          variant="ghost"
                          ml={2}
                          color="red.400"
                          onClick={() => {
                            setAttachments(attachments.filter((_, i) => i !== index));
                          }}
                          _hover={{ bg: "red.50", color: "red.500" }}
                        />
                      </Flex>
                    ))}
                  </Flex>
                )}
              
                <Flex direction="column">
                  <Box 
                    borderWidth="2px" 
                    borderColor={isMember(selectedCommunity?._id) ? "teal.200" : "gray.200"} 
                    borderRadius="md" 
                    overflow="hidden"
                    transition="all 0.3s"
                    bg="white"
                    _focusWithin={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                  >
                    <Textarea
                      placeholder={
                        isMember(selectedCommunity?._id) 
                          ? "Type your message..." 
                          : "Join this community to send messages"
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      isDisabled={!isMember(selectedCommunity?._id)}
                      resize="none"
                      border="none"
                      p={3}
                      minH="60px"
                      fontSize="sm"
                      _focus={{ boxShadow: "none" }}
                    />

                    <Flex justifyContent="space-between" alignItems="center" p={2} bg="gray.50">
                      <HStack spacing={2}>
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          disabled={!isMember(selectedCommunity?._id)}
                        />
                        <Tooltip label="Attach files" hasArrow>
                          <IconButton
                            aria-label="Attach files"
                            icon={<FiPaperclip />}
                            size="sm"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            isDisabled={!isMember(selectedCommunity?._id)}
                            color="teal.500"
                            _hover={{ bg: "teal.50" }}
                            rounded="full"
                          />
                        </Tooltip>
                        <Tooltip label="Insert emoji" hasArrow>
                          <IconButton
                            aria-label="Insert emoji"
                            icon={<FiSmile />}
                            size="sm"
                            variant="ghost"
                            isDisabled={!isMember(selectedCommunity?._id)}
                            color="teal.500"
                            _hover={{ bg: "teal.50" }}
                            rounded="full"
                          />
                        </Tooltip>
                      </HStack>
                      
                      <Button
                        colorScheme="teal"
                        onClick={handleSendMessage}
                        leftIcon={<FiSend />}
                        isDisabled={!isMember(selectedCommunity?._id) || (!message.trim() && attachments.length === 0)}
                        size="sm"
                        px={4}
                        _hover={{ bg: "teal.600" }}
                        boxShadow="sm"
                        fontWeight="bold"
                      >
                        Send
                      </Button>
                    </Flex>
                  </Box>
                  
                  {!isMember(selectedCommunity?._id) && (
                    <Text fontSize="xs" color="red.500" mt={2} textAlign="center">
                      You must join this community to send messages
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          ) : selectedCommunity ? (
            <Flex direction="column" h="65vh" borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
              {/* Header */}
              <Box p={3} bg={headerBg} color={headerColor} backgroundImage="linear-gradient(to right, teal.600, teal.400)">
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar 
                      size="sm" 
                      name={selectedCommunity.name.substring(0, 2)} 
                      src={selectedCommunity.avatar}
                      borderWidth={2}
                      borderColor="white"
                    />
                    <Box>
                      <Text fontWeight="bold">{selectedCommunity.name}</Text>
                      <Flex align="center">
                        <Icon as={FiUsers} fontSize="xs" mr={1} />
                        <Text fontSize="xs" mr={2}>{selectedCommunity.members?.length || 0} members</Text>
                        {isMember(selectedCommunity._id) ? (
                          <Badge colorScheme="green" fontSize="xs">Member</Badge>
                        ) : (
                          <Badge colorScheme="gray" fontSize="xs">Not Joined</Badge>
                        )}
                      </Flex>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      leftIcon={<Icon as={FiUsers} />}
                      onClick={() => setShowMembers(!showMembers)}
                    >
                      Members
                    </Button>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Community options"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "teal.600" }}
                      />
                      <MenuList>
                        <MenuItem icon={<Icon as={FiUsers} />}>View Members</MenuItem>
                        <MenuItem icon={<Icon as={FiSettings} />}>Community Settings</MenuItem>
                        {isMember(selectedCommunity._id) ? (
                          <MenuItem 
                            icon={<Icon as={FiUserMinus} />} 
                            color="red.500"
                            onClick={() => handleLeaveCommunity(selectedCommunity._id)}
                          >
                            Leave Community
                          </MenuItem>
                        ) : (
                          <MenuItem 
                            icon={<Icon as={FiUserPlus} />} 
                            color="green.500"
                            onClick={() => handleJoinCommunity(selectedCommunity._id)}
                          >
                            Join Community
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </HStack>
                </Flex>
              </Box>
              
              {/* Messages Area with Community Info Toggle */}
              <Box flex="1" display="flex">
                {/* Main Chat Area */}
                <Box 
                  flex="1" 
                  overflowY="auto" 
                  bg={cardBg}
                  p={3}
                  maxH="400px"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                    },
                  }}
                >
                  {/* Messages Content */}
                  <VStack spacing={3} align="stretch">
                    {messages.length === 0 ? (
                      <Flex direction="column" justify="center" align="center" h="150px">
                        <Icon as={FiMessageSquare} boxSize={12} color="gray.300" mb={4} />
                        <Text color="gray.500">No messages yet</Text>
                        <Text fontSize="sm" mt={2}>Be the first to send a message!</Text>
                        
                        {!isMember(selectedCommunity._id) && (
                          <Button
                            mt={4}
                            colorScheme="teal"
                            leftIcon={<Icon as={FiUserPlus} />}
                            onClick={() => handleJoinCommunity(selectedCommunity._id)}
                          >
                            Join to Send Messages
                          </Button>
                        )}
                      </Flex>
                    ) : (
                      groupMessagesByDate(messages).map((item, index) => {
                        if (item.type === 'date') {
                          return (
                            <Flex key={`date-${index}`} align="center" justify="center" py={2}>
                              <Divider flex="1" />
                              <Badge px={2} mx={2} colorScheme="teal">
                                {item.date}
                              </Badge>
                              <Divider flex="1" />
                            </Flex>
                          );
                        } else {
                          const isCurrentUser = item.isCurrentUser;
                          return (
                            <Box key={`msg-${item._id}`} mb={3}>
                              <HStack spacing={3} align="flex-start">
                                <Avatar 
                                  size="sm" 
                                  name={item.sender.name} 
                                  src={item.sender.profilePicture}
                                  bg={`hsl(${item.sender.name.charCodeAt(0) % 360}, 70%, 75%)`}
                                  border="2px solid"
                                  borderColor={isCurrentUser ? "teal.300" : "gray.200"}
                                  boxShadow="sm"
                                />
                                <Box flex="1">
                                  <Flex align="baseline">
                                    <Text fontWeight="bold" fontSize="sm" color={isCurrentUser ? THEME.primary : undefined}>
                                      {item.sender.name}
                                      {isCurrentUser && " (You)"}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500" ml={2}>
                                      {formatMessageTime(item.createdAt)}
                                    </Text>
                                  </Flex>
                                  
                                  <Box 
                                    mt={1} 
                                    p={3} 
                                    bg={isCurrentUser ? 'teal.50' : 'gray.50'} 
                                    borderRadius="lg"
                                    borderLeftWidth="3px"
                                    borderLeftColor={isCurrentUser ? 'teal.500' : 'gray.300'}
                                    boxShadow="sm"
                                    position="relative"
                                    _after={{
                                      content: '""',
                                      position: 'absolute',
                                      left: '-10px',
                                      top: '10px',
                                      width: '0',
                                      height: '0',
                                      borderTop: '5px solid transparent',
                                      borderBottom: '5px solid transparent',
                                      borderRight: `10px solid ${isCurrentUser ? 'var(--chakra-colors-teal-50)' : 'var(--chakra-colors-gray-50)'}`
                                    }}
                                  >
                                    {item.content && (
                                      <Text fontSize="sm" lineHeight="1.6" whiteSpace="pre-wrap">
                                        {item.content}
                                      </Text>
                                    )}
                                    
                                    {/* Render attachments if any */}
                                    {item.attachments && item.attachments.length > 0 && (
                                      <Flex mt={3} flexWrap="wrap" gap={3}>
                                        {item.attachments.map((attachment, attachIndex) => {
                                          if (attachment.type === 'image') {
                                            return (
                                              <Box 
                                                key={`attach-${attachIndex}`} 
                                                borderWidth={1} 
                                                borderRadius="md"
                                                borderColor={borderColor}
                                                overflow="hidden"
                                                maxW="200px"
                                                boxShadow="md"
                                                transition="transform 0.3s"
                                                _hover={{ transform: 'scale(1.03)' }}
                                              >
                                                <Image 
                                                  src={attachment.url} 
                                                  alt={attachment.name || 'Attached image'} 
                                                  maxH="150px"
                                                  objectFit="cover"
                                                  width="100%"
                                                />
                                                <Flex p={1} bg={hoverBg} alignItems="center" justifyContent="space-between">
                                                  <Text fontSize="xs" noOfLines={1} flex="1">
                                                    {attachment.name}
                                                  </Text>
                                                  <IconButton
                                                    icon={<FiImage />}
                                                    size="xs"
                                                    variant="ghost"
                                                    colorScheme="teal"
                                                    aria-label="View"
                                                  />
                                                </Flex>
                                              </Box>
                                            );
                                          } else {
                                            return (
                                              <Flex
                                                key={`attach-${attachIndex}`}
                                                borderWidth={1}
                                                borderRadius="md"
                                                borderColor={borderColor}
                                                p={3}
                                                alignItems="center"
                                                bg={hoverBg}
                                                _hover={{ bg: 'gray.100' }}
                                                cursor="pointer"
                                                transition="all 0.2s"
                                              >
                                                <Icon as={FiFile} mr={2} color="blue.500" boxSize={5} />
                                                <Box>
                                                  <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                                                    {attachment.name}
                                                  </Text>
                                                  {attachment.size && (
                                                    <Text fontSize="xs" color="gray.500">
                                                      {formatFileSize(attachment.size)}
                                                    </Text>
                                                  )}
                                                </Box>
                                              </Flex>
                                            );
                                          }
                                        })}
                                      </Flex>
                                    )}
                                  </Box>
                                </Box>
                              </HStack>
                            </Box>
                          );
                        }
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>
                
                {/* Community Members Sidebar (Conditionally Shown) */}
                {showMembers && (
                  <Box 
                    width="200px" 
                    bg={hoverBg} 
                    borderLeftWidth="1px" 
                    borderColor={borderColor}
                    overflowY="auto"
                  >
                    <Box p={2} bg={THEME.primary} color="white">
                      <Text fontWeight="bold" fontSize="sm">Community Members</Text>
                    </Box>
                    <VStack align="stretch" spacing={0}>
                      {selectedCommunity.members.map(member => (
                        <Flex 
                          key={member.user} 
                          p={2} 
                          alignItems="center"
                          borderBottomWidth="1px"
                          borderColor={borderColor}
                        >
                          <Box position="relative">
                            <Avatar 
                              size="xs" 
                              name={member.name} 
                              src={member.profilePicture}
                            />
                            {member.isOnline && (
                              <Box 
                                position="absolute" 
                                bottom="0" 
                                right="0"
                                bg="green.400" 
                                borderRadius="full" 
                                boxSize="8px" 
                                borderWidth="1.5px" 
                                borderColor="white" 
                              />
                            )}
                          </Box>
                          <Box ml={2}>
                            <Text fontSize="xs" fontWeight="medium">{member.name}</Text>
                            <Badge size="xs" colorScheme={
                              member.role === 'admin' ? 'red' : 
                              member.role === 'moderator' ? 'purple' : 'gray'
                            }>
                              {member.role}
                            </Badge>
                          </Box>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
              
              {/* Message Input */}
              <Box p={3} bg={hoverBg} borderTopWidth={1} borderColor={borderColor}>
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <Flex mb={2} overflowX="auto" gap={2} pb={2}>
                    {attachments.map((file, index) => (
                      <Flex 
                        key={`preview-${index}`}
                        align="center"
                        borderWidth={1}
                        borderRadius="md"
                        p={2}
                        bg="white"
                        borderColor="teal.200"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "md", borderColor: "teal.300" }}
                      >
                        <Icon 
                          as={file.type === 'image' ? FiImage : FiFile} 
                          mr={2}
                          color="teal.500"
                          boxSize={5}
                        />
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1} maxW="150px">
                          {file.name}
                        </Text>
                        <IconButton
                          icon={<Icon as={FiMoreVertical} />}
                          size="xs"
                          variant="ghost"
                          ml={2}
                          color="red.400"
                          onClick={() => {
                            setAttachments(attachments.filter((_, i) => i !== index));
                          }}
                          _hover={{ bg: "red.50", color: "red.500" }}
                        />
                      </Flex>
                    ))}
                  </Flex>
                )}
              
                <Flex direction="column">
                  <Box 
                    borderWidth="2px" 
                    borderColor={isMember(selectedCommunity?._id) ? "teal.200" : "gray.200"} 
                    borderRadius="md" 
                    overflow="hidden"
                    transition="all 0.3s"
                    bg="white"
                    _focusWithin={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                  >
                    <Textarea
                      placeholder={
                        isMember(selectedCommunity?._id) 
                          ? "Type your message..." 
                          : "Join this community to send messages"
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      isDisabled={!isMember(selectedCommunity?._id)}
                      resize="none"
                      border="none"
                      p={3}
                      minH="60px"
                      fontSize="sm"
                      _focus={{ boxShadow: "none" }}
                    />

                    <Flex justifyContent="space-between" alignItems="center" p={2} bg="gray.50">
                      <HStack spacing={2}>
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          disabled={!isMember(selectedCommunity?._id)}
                        />
                        <Tooltip label="Attach files" hasArrow>
                          <IconButton
                            aria-label="Attach files"
                            icon={<FiPaperclip />}
                            size="sm"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            isDisabled={!isMember(selectedCommunity?._id)}
                            color="teal.500"
                            _hover={{ bg: "teal.50" }}
                            rounded="full"
                          />
                        </Tooltip>
                        <Tooltip label="Insert emoji" hasArrow>
                          <IconButton
                            aria-label="Insert emoji"
                            icon={<FiSmile />}
                            size="sm"
                            variant="ghost"
                            isDisabled={!isMember(selectedCommunity?._id)}
                            color="teal.500"
                            _hover={{ bg: "teal.50" }}
                            rounded="full"
                          />
                        </Tooltip>
                      </HStack>
                      
                      <Button
                        colorScheme="teal"
                        onClick={handleSendMessage}
                        leftIcon={<FiSend />}
                        isDisabled={!isMember(selectedCommunity?._id) || (!message.trim() && attachments.length === 0)}
                        size="sm"
                        px={4}
                        _hover={{ bg: "teal.600" }}
                        boxShadow="sm"
                        fontWeight="bold"
                      >
                        Send
                      </Button>
                    </Flex>
                  </Box>
                  
                  {!isMember(selectedCommunity?._id) && (
                    <Text fontSize="xs" color="red.500" mt={2} textAlign="center">
                      You must join this community to send messages
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          ) : (
            <Flex 
              direction="column" 
              justify="center" 
              align="center" 
              h="65vh" 
              borderWidth={1} 
              borderRadius="lg"
              bg={cardBg}
              boxShadow="md"
              backgroundImage="linear-gradient(to bottom, rgba(237, 242, 247, 0.6), white)"
            >
              <Icon as={FiMessageSquare} boxSize={16} color="teal.300" mb={6} />
              <Heading fontSize="2xl" color="gray.700" mb={2}>
                Connect with Communities
              </Heading>
              <Text fontSize="md" color="gray.500" maxW="sm" textAlign="center" mb={6}>
                Select a campus community to start chatting or send direct messages to other students and faculty
              </Text>
              <Button
                size="lg"
                colorScheme="teal"
                leftIcon={<Icon as={FiPlus} />}
                onClick={onCreateOpen}
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                Create New Community
              </Button>
            </Flex>
          )}
        </GridItem>
        
        {/* Members List */}
        <GridItem>
          <Flex direction="column" h="75vh" borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
            <Box p={3} bg={headerBg} color={headerColor} backgroundImage="linear-gradient(to right, teal.600, teal.400)">
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FiUsers} mr={2} />
                  <Text fontWeight="bold">Active Users</Text>
                </Flex>
                {currentUser && (
                  <Tooltip label="Edit Profile" placement="top" hasArrow>
                    <IconButton
                      icon={<FiEdit />}
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      onClick={onProfileOpen}
                    />
                  </Tooltip>
                )}
              </Flex>
            </Box>
            <Box flex="1" overflowY="auto" bg={cardBg}>
              <VStack spacing={0} align="stretch">
                {activeUsers.map(user => {
                  const isCurrentUser = user._id === currentUser._id;
                  const isActive = activeChat?._id === user._id;
                  
                  return (
                    <Box 
                      key={user._id}
                      px={3}
                      py={2}
                      bg={isActive ? selectedBg : "transparent"}
                      _hover={{ bg: isActive ? selectedBg : hoverBg }}
                      cursor={isCurrentUser ? "default" : "pointer"}
                      borderBottomWidth="1px"
                      borderColor={borderColor}
                      onClick={() => {
                        if (!isCurrentUser) {
                          handleDirectMessage(user._id);
                        }
                      }}
                    >
                      <HStack spacing={3}>
                        <Box position="relative">
                          <Avatar 
                            size="sm" 
                            name={user.name} 
                            src={user.profilePicture}
                            border="2px solid"
                            borderColor={user.isOnline ? "green.300" : "gray.200"}
                          />
                          {user.isOnline && (
                            <Box 
                              position="absolute" 
                              bottom="0" 
                              right="0"
                              bg="green.400" 
                              borderRadius="full" 
                              boxSize="10px" 
                              borderWidth="2px" 
                              borderColor="white" 
                            />
                          )}
                        </Box>
                        
                        <Box flex="1">
                          <Flex align="center">
                            <Text fontSize="sm" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
                              {user.name}
                            </Text>
                            {isCurrentUser && (
                              <Badge ml={1} colorScheme="teal" fontSize="xs">You</Badge>
                            )}
                          </Flex>
                          <Flex align="center">
                            <Box 
                              w={2} 
                              h={2} 
                              borderRadius="full" 
                              bg={user.isOnline ? "green.400" : "gray.300"} 
                              mr={1}
                            />
                            <Text fontSize="xs" color={user.isOnline ? 'green.500' : 'gray.500'}>
                              {user.isOnline ? 'Online' : 'Offline'}
                            </Text>
                          </Flex>
                        </Box>
                        
                        {!isCurrentUser && (
                          <Tooltip label="Send message" hasArrow>
                            <IconButton
                              size="xs"
                              icon={<FiMessageSquare />}
                              colorScheme="teal"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirectMessage(user._id);
                              }}
                              _hover={{ bg: 'teal.50', color: 'teal.700' }}
                            />
                          </Tooltip>
                        )}
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
            <Box p={3} bg={hoverBg} borderTopWidth="1px" borderColor={borderColor}>
              <Flex align="center" justify="space-between">
                <Text fontSize="sm">
                  <Badge colorScheme="green" mr={1}>
                    {activeUsers.filter(u => u.isOnline).length}
                  </Badge> 
                  online
                </Text>
                <Text fontSize="sm">
                  <Badge colorScheme="gray" mr={1}>
                    {activeUsers.length - activeUsers.filter(u => u.isOnline).length}
                  </Badge> 
                  offline
                </Text>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      
      {/* Create Community Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            bg={headerBg} 
            color={headerColor} 
            borderTopRadius="md"
            backgroundImage="linear-gradient(to right, teal.600, teal.400)"
          >
            Create New Campus Community
          </ModalHeader>
          <ModalCloseButton color={headerColor} />
          
          <ModalBody pt={4}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Community Name</FormLabel>
                <Input
                  placeholder="Enter community name"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontWeight="medium">Description</FormLabel>
                <Textarea
                  placeholder="Describe your community (optional)"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  resize="vertical"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontWeight="medium">Tags</FormLabel>
                <Input
                  placeholder="Add tags and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Tags help others find your community (max 5)
                </Text>
                
                {newCommunity.tags.length > 0 && (
                  <Flex mt={2} flexWrap="wrap" gap={2}>
                    {newCommunity.tags.map((tag, index) => (
                      <Tag 
                        key={index} 
                        colorScheme="teal" 
                        size="md"
                        borderRadius="full"
                      >
                        <TagLabel>{tag}</TagLabel>
                        <Icon 
                          as={FiMoreVertical} 
                          ml={1} 
                          cursor="pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Tag>
                    ))}
                  </Flex>
                )}
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <Switch
                  id="isPublic"
                  isChecked={newCommunity.isPublic}
                  onChange={(e) => setNewCommunity({...newCommunity, isPublic: e.target.checked})}
                  colorScheme="teal"
                  mr={3}
                />
                <FormLabel htmlFor="isPublic" mb={0} fontSize="sm">
                  Public Community
                </FormLabel>
                <Icon 
                  as={newCommunity.isPublic ? FiGlobe : FiLock} 
                  color={newCommunity.isPublic ? "teal.500" : "gray.500"}
                  ml={1}
                />
              </FormControl>
              
              {!newCommunity.isPublic && (
                <Box bg="yellow.50" p={3} borderRadius="md">
                  <Text fontSize="sm">
                    Private communities are only visible to members and require an invitation to join.
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter bg={hoverBg} borderBottomRadius="md">
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleCreateCommunity}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={onProfileClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            bg={headerBg} 
            color={headerColor} 
            borderTopRadius="md"
            backgroundImage="linear-gradient(to right, teal.600, teal.400)"
          >
            My Profile
          </ModalHeader>
          <ModalCloseButton color={headerColor} />
          
          <ModalBody pt={6} pb={6}>
            <VStack spacing={6} align="center">
              {/* Profile Picture Section */}
              <Box position="relative" textAlign="center">
                {previewImage ? (
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      src={previewImage}
                      border="4px solid"
                      borderColor="teal.400"
                    />
                    <HStack spacing={2} mt={3} justifyContent="center">
                      <Button
                        size="sm"
                        leftIcon={<FiSave />}
                        colorScheme="teal"
                        onClick={saveProfilePicture}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<FiXCircle />}
                        variant="outline"
                        onClick={cancelProfilePictureUpload}
                      >
                        Cancel
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={currentUser.name}
                      src={currentUser.profilePicture}
                      border="4px solid"
                      borderColor="teal.400"
                    />
                    {isUploading ? (
                      <Box position="absolute" top="0" left="0" right="0" bottom="0" 
                        display="flex" alignItems="center" justifyContent="center" 
                        borderRadius="full" bg="rgba(0,0,0,0.5)" color="white">
                        <Text>{Math.round(uploadProgress)}%</Text>
                      </Box>
                    ) : (
                      <IconButton
                        icon={<FiCamera />}
                        position="absolute"
                        bottom="0"
                        right="0"
                        colorScheme="teal"
                        borderRadius="full"
                        size="sm"
                        onClick={() => profileImageRef.current?.click()}
                      />
                    )}
                    <input
                      type="file"
                      ref={profileImageRef}
                      onChange={handleProfilePictureUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </Box>
                )}
              </Box>
              
              <Box textAlign="center" w="100%">
                <Heading size="md" mb={2}>{currentUser.name}</Heading>
                <Badge colorScheme="green" mb={3}>Online</Badge>
                
                <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
                  <Flex alignItems="center" justifyContent="center" mb={2}>
                    <Icon as={FiCamera} mr={2} color="teal.500" />
                    <Text fontWeight="medium" fontSize="sm">Upload Profile Picture</Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Click the camera icon on your profile picture to upload a new one.
                  </Text>
                  <HStack spacing={2} fontSize="xs" color="gray.500" mt={2} justifyContent="center">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>JPG, PNG, GIF</Text>
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Max 5MB</Text>
                  </HStack>
                  <Button
                    mt={3}
                    size="sm"
                    width="full"
                    leftIcon={<FiUpload />}
                    onClick={() => profileImageRef.current?.click()}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Select Image File
                  </Button>
                </Box>
                
                <FormControl mt={4}>
                  <FormLabel fontWeight="medium">Username</FormLabel>
                  <Input
                    value={currentUser.name}
                    readOnly
                    bg="gray.50"
                  />
                </FormControl>
                
                <FormControl mt={4}>
                  <FormLabel fontWeight="medium">User ID</FormLabel>
                  <Input
                    value={currentUser._id}
                    readOnly
                    bg="gray.50"
                    fontFamily="monospace"
                    fontSize="sm"
                  />
                </FormControl>
                
                <Alert status="info" mt={4} borderRadius="md">
                  <AlertIcon />
                  <Box fontSize="sm">
                    <AlertTitle>Local Storage Mode</AlertTitle>
                    <AlertDescription>
                      Profile pictures are saved to your browser's local storage in this demo.
                    </AlertDescription>
                  </Box>
                </Alert>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter bg={hoverBg} borderBottomRadius="md">
            <Button variant="outline" mr={3} onClick={onProfileClose}>
              Close
            </Button>
            {!previewImage && !isUploading && (
              <Button 
                colorScheme="teal" 
                leftIcon={<FiCamera />}
                onClick={() => profileImageRef.current?.click()}
              >
                Change Picture
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <style>{customStyles}</style>
    </Box>
  );
};

export default SimpleCommunity; 