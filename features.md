# Campus Connect E-Learning Platform - Project Report

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Key Features & Code Analysis](#key-features)
6. [Security Implementation](#security)
7. [Database Design](#database)
8. [UI/UX Design](#ui-ux)

## 1. Project Overview

### 1.1 Introduction
Campus Connect is a comprehensive e-learning platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform provides a modern, responsive interface for students to access courses, interact with peers, and track their learning progress.

### 1.2 Technology Stack
- Frontend: React.js, Chakra UI, Framer Motion
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Storage: Cloudinary
- Additional: React Router, Axios, React Toastify

## 2. System Architecture

### 2.1 High-Level Architecture
\`\`\`javascript
// App.jsx - Main Application Structure
import React from "react";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <div className={`app-container theme-${appTheme}`}>
        {showNavbar && <Navbar />}
        {showSidebar && <SidebarNav />}
        <div className={isFullPageRoute ? "fullscreen-content" : "main-content"}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            {/* Other routes */}
          </Routes>
        </div>
      </div>
    </ChakraProvider>
  );
};
\`\`\`

## 3. Frontend Implementation

### 3.1 Authentication System

#### 3.1.1 Registration Component
\`\`\`javascript
// Register.jsx
import React, { useState } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Button, Text, 
         useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    year: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        course: formData.course,
        year: formData.year
      });

      toast({
        title: "Success",
        description: "Registration successful! Please login.",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </FormControl>

          <FormControl>
            <FormLabel>College</FormLabel>
            <Input
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Course</FormLabel>
            <Input
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Enter your course"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Year</FormLabel>
            <Input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter your year of study"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
          >
            Register
          </Button>

          <Text>
            Already have an account?{" "}
            <RouterLink to="/login" style={{ color: "blue.500" }}>
              Login here
            </RouterLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
\`\`\`

#### 3.1.2 Login Component with JWT
\`\`\`javascript
// Login.jsx
const Login = () => {
  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
};
\`\`\`

### 3.2 Course Management

#### 3.2.1 Course Dashboard
\`\`\`javascript
// CourseDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Heading, Text, Button, useToast, 
  SimpleGrid, Progress, Badge, Flex, Icon
} from '@chakra-ui/react';
import { FiBook, FiClock, FiAward, FiUsers } from 'react-icons/fi';
import axios from 'axios';

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgress: 0,
    achievements: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/enrolled', {
        headers: {
          Authorization: \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      setCourses(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/stats', {
        headers: {
          Authorization: \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Flex align="center" mb={2}>
        <Icon as={icon} boxSize={6} color={color} mr={2} />
        <Text fontSize="lg" fontWeight="medium">{label}</Text>
      </Flex>
      <Text fontSize="2xl" fontWeight="bold">{value}</Text>
    </Box>
  );

  const CourseCard = ({ course }) => (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={2}>{course.title}</Heading>
      <Text color="gray.600" noOfLines={2} mb={4}>
        {course.description}
      </Text>
      <Progress 
        value={course.progress} 
        colorScheme="blue" 
        size="sm" 
        mb={4} 
      />
      <Flex justify="space-between" align="center">
        <Badge colorScheme={course.progress === 100 ? "green" : "blue"}>
          {course.progress === 100 ? "Completed" : "In Progress"}
        </Badge>
        <Button size="sm" colorScheme="blue" variant="outline">
          Continue
        </Button>
      </Flex>
    </Box>
  );

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Course Dashboard</Heading>
      
      {/* Stats Section */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          icon={FiBook} 
          label="Total Courses" 
          value={stats.totalCourses}
          color="blue.500" 
        />
        <StatCard 
          icon={FiAward} 
          label="Completed" 
          value={stats.completedCourses}
          color="green.500" 
        />
        <StatCard 
          icon={FiClock} 
          label="In Progress" 
          value={stats.inProgress}
          color="orange.500" 
        />
        <StatCard 
          icon={FiUsers} 
          label="Achievements" 
          value={stats.achievements}
          color="purple.500" 
        />
      </SimpleGrid>

      {/* Courses Grid */}
      <Heading size="md" mb={4}>My Courses</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CourseDashboard;
\`\`\`

## 4. Backend Implementation

### 4.1 User Authentication
\`\`\`javascript
// userRoutes.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
\`\`\`

### 4.2 Course Management
\`\`\`javascript
// courseRoutes.js
router.get("/courses", auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .select('-__v');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

router.post("/courses", auth, async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      instructor: req.user.id
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
  }
});
\`\`\`

## 5. Key Features & Code Analysis

### 5.1 Profile Management
\`\`\`javascript
// ProfilePage.jsx
const ProfilePage = () => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await axios.post('/api/users/profile-picture', formData);
      setUser(prev => ({...prev, profilePic: response.data.url}));
    } catch (error) {
      toast.error('Failed to update profile picture');
    }
  };

  return (
    <Box>
      <Avatar
        size="2xl"
        name={user.name}
        src={user.profilePic}
        cursor="pointer"
        onClick={() => document.getElementById('profilePic').click()}
      />
      <input
        id="profilePic"
        type="file"
        hidden
        onChange={handleImageUpload}
      />
      {/* Other profile information */}
    </Box>
  );
};
\`\`\`

### 5.2 Real-time Chat Implementation
\`\`\`javascript
// ChatComponent.jsx
const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = (message) => {
    socket.emit('sendMessage', {
      userId: user._id,
      message: message
    });
  };

  return (
    <VStack spacing={4}>
      <Box h="400px" overflowY="auto">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
      </Box>
      <MessageInput onSend={sendMessage} />
    </VStack>
  );
};
\`\`\`

### 5.3 Chatbot Implementation
\`\`\`javascript
// ChatbotComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, VStack, Input, Button, Text, Avatar,
  useToast, Flex, IconButton, Spinner
} from '@chakra-ui/react';
import { FiSend, FiRefreshCcw } from 'react-icons/fi';
import axios from 'axios';

const ChatbotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: input
      }, {
        headers: {
          Authorization: \`Bearer \${localStorage.getItem('token')}\`
        }
      });

      const botMessage = {
        type: 'bot',
        content: response.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from chatbot",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Message = ({ message }) => (
    <Flex
      justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
      mb={4}
    >
      {message.type === 'bot' && (
        <Avatar
          size="sm"
          name="AI Assistant"
          src="/bot-avatar.png"
          mr={2}
        />
      )}
      <Box
        bg={message.type === 'user' ? 'blue.500' : 'gray.100'}
        color={message.type === 'user' ? 'white' : 'black'}
        borderRadius="lg"
        px={4}
        py={2}
        maxW="70%"
      >
        <Text>{message.content}</Text>
        <Text fontSize="xs" color={message.type === 'user' ? 'white' : 'gray.500'}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </Box>
      {message.type === 'user' && (
        <Avatar
          size="sm"
          name="User"
          src={localStorage.getItem('userAvatar')}
          ml={2}
        />
      )}
    </Flex>
  );

  return (
    <Box h="full" maxH="600px" w="full" maxW="800px" mx="auto">
      <VStack h="full" spacing={4}>
        <Box
          flex={1}
          w="full"
          overflowY="auto"
          p={4}
          borderWidth={1}
          borderRadius="lg"
        >
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <Flex justify="flex-start" mb={4}>
              <Spinner size="sm" mr={2} />
              <Text>AI is typing...</Text>
            </Flex>
          )}
        </Box>
        
        <Flex w="full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            mr={2}
          />
          <IconButton
            icon={<FiSend />}
            onClick={handleSend}
            isLoading={isLoading}
            colorScheme="blue"
          />
          <IconButton
            icon={<FiRefreshCcw />}
            onClick={() => setMessages([])}
            ml={2}
            variant="ghost"
          />
        </Flex>
      </VStack>
    </Box>
  );
};

export default ChatbotComponent;
\`\`\`

### 5.4 Events Management
\`\`\`javascript
// EventsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Badge,
  SimpleGrid, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select,
  useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    type: 'workshop',
    capacity: ''
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setEvents(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      toast({
        title: "Success",
        description: "Event created successfully",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      onClose();
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create event",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const EventCard = ({ event }) => (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="sm"
      bg="white"
      position="relative"
    >
      <Badge
        position="absolute"
        top={4}
        right={4}
        colorScheme={
          event.type === 'workshop' ? 'blue' :
          event.type === 'webinar' ? 'green' :
          event.type === 'hackathon' ? 'purple' : 'gray'
        }
      >
        {event.type}
      </Badge>
      <VStack align="start" spacing={3}>
        <Heading size="md">{event.title}</Heading>
        <Text color="gray.600">{event.description}</Text>
        <Text fontWeight="bold">
          📅 {new Date(event.date).toLocaleDateString()}
          {' '}at {event.time}
        </Text>
        <Text>📍 {event.venue}</Text>
        <Text>👥 Capacity: {event.capacity} participants</Text>
        <Button colorScheme="blue" size="sm">
          Register for Event
        </Button>
      </VStack>
    </Box>
  );

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Events</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Create New Event
        </Button>
      </Flex>

      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    time: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Venue</FormLabel>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    venue: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Event Type</FormLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                >
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="career-fair">Career Fair</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Capacity</FormLabel>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: e.target.value
                  }))}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                Create Event
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsPage;
\`\`\`

### 5.5 Community Forum
\`\`\`javascript
// CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Avatar,
  Input, Textarea, useToast, Flex, IconButton,
  Divider, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { FiMoreVertical, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import axios from 'axios';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/community/posts', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setPosts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/community/posts', 
        { content: newPost },
        { headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }}
      );
      setPosts(prev => [response.data, ...prev]);
      setNewPost('');
      toast({
        title: "Success",
        description: "Post created successfully",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(\`/api/community/posts/\${postId}/like\`, {}, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const Post = ({ post }) => (
    <Box borderWidth={1} borderRadius="lg" p={4} mb={4} bg="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center">
          <Avatar
            size="sm"
            name={post.author.username}
            src={post.author.profilePic}
            mr={2}
          />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{post.author.username}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </VStack>
        </Flex>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Report</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Text mb={4}>{post.content}</Text>

      {post.image && (
        <Box mb={4}>
          <Image
            src={post.image}
            alt="Post attachment"
            borderRadius="md"
            maxH="400px"
            w="full"
            objectFit="cover"
          />
        </Box>
      )}

      <Flex justify="space-between" align="center">
        <Flex>
          <Button
            leftIcon={<FiHeart />}
            variant="ghost"
            size="sm"
            colorScheme={post.isLiked ? "red" : "gray"}
            onClick={() => handleLike(post._id)}
          >
            {post.likes}
          </Button>
          <Button
            leftIcon={<FiMessageSquare />}
            variant="ghost"
            size="sm"
            ml={2}
          >
            {post.comments.length}
          </Button>
          <Button
            leftIcon={<FiShare2 />}
            variant="ghost"
            size="sm"
            ml={2}
          >
            Share
          </Button>
        </Flex>
      </Flex>

      {post.comments.length > 0 && (
        <VStack mt={4} align="stretch">
          <Divider />
          {post.comments.map(comment => (
            <Box key={comment._id} pt={2}>
              <Flex align="start">
                <Avatar
                  size="xs"
                  name={comment.author.username}
                  src={comment.author.profilePic}
                  mr={2}
                />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {comment.author.username}
                  </Text>
                  <Text fontSize="sm">{comment.content}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );

  return (
    <Box p={8}>
      <Heading mb={6}>Community Forum</Heading>

      <Box mb={6}>
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with the community..."
          mb={2}
        />
        <Button
          colorScheme="blue"
          isLoading={isLoading}
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Box>

      <VStack spacing={4} align="stretch">
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </VStack>
    </Box>
  );
};

export default CommunityPage;
\`\`\`

### 5.6 Placement Hub
\`\`\`javascript
// PlacementHub.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Badge,
  SimpleGrid, useToast, Tabs, TabList, TabPanels,
  TabPanel, Tab, Grid, GridItem, Progress,
  Stat, StatLabel, StatNumber, StatHelpText,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBriefcase, FiTrendingUp, FiCalendar, FiUsers } from 'react-icons/fi';
import axios from 'axios';

const PlacementHub = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState({
    totalPlacements: 0,
    averagePackage: 0,
    ongoingDrives: 0,
    registeredStudents: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchOpportunities();
    fetchStats();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('/api/placement/opportunities', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setOpportunities(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch opportunities",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/placement/stats', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, helpText }) => (
    <Stat
      px={4}
      py={3}
      bg={cardBg}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Flex justify="space-between">
        <Box>
          <StatLabel color="gray.500">{label}</StatLabel>
          <StatNumber fontSize="2xl">{value}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Box>
        <Box>
          <Icon size={24} />
        </Box>
      </Flex>
    </Stat>
  );

  const OpportunityCard = ({ opportunity }) => (
    <Box
      p={6}
      bg={cardBg}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Flex justify="space-between" align="start" mb={4}>
        <VStack align="start" spacing={1}>
          <Heading size="md">{opportunity.company}</Heading>
          <Text color="blue.500" fontWeight="bold">
            {opportunity.role}
          </Text>
        </VStack>
        <Badge
          colorScheme={opportunity.status === 'active' ? 'green' : 'red'}
        >
          {opportunity.status}
        </Badge>
      </Flex>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
        <GridItem>
          <Text color="gray.500">Package</Text>
          <Text fontWeight="bold">₹{opportunity.package} LPA</Text>
        </GridItem>
        <GridItem>
          <Text color="gray.500">Location</Text>
          <Text fontWeight="bold">{opportunity.location}</Text>
        </GridItem>
        <GridItem>
          <Text color="gray.500">Experience</Text>
          <Text fontWeight="bold">{opportunity.experience}</Text>
        </GridItem>
        <GridItem>
          <Text color="gray.500">Positions</Text>
          <Text fontWeight="bold">{opportunity.positions}</Text>
        </GridItem>
      </Grid>

      <Text noOfLines={3} mb={4} color="gray.600">
        {opportunity.description}
      </Text>

      <VStack spacing={2} align="stretch">
        <Text fontWeight="bold">Requirements:</Text>
        {opportunity.requirements.map((req, index) => (
          <Text key={index} fontSize="sm">• {req}</Text>
        ))}
      </VStack>

      <Flex mt={4} justify="space-between" align="center">
        <Text fontSize="sm" color="gray.500">
          Last Date: {new Date(opportunity.lastDate).toLocaleDateString()}
        </Text>
        <Button colorScheme="blue" size="sm">
          Apply Now
        </Button>
      </Flex>
    </Box>
  );

  return (
    <Box p={8}>
      <Heading mb={6}>Placement Hub</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          icon={FiBriefcase}
          label="Total Placements"
          value={stats.totalPlacements}
          helpText="This academic year"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Average Package"
          value={\`₹\${stats.averagePackage} LPA\`}
          helpText="Current batch"
        />
        <StatCard
          icon={FiCalendar}
          label="Ongoing Drives"
          value={stats.ongoingDrives}
          helpText="Active now"
        />
        <StatCard
          icon={FiUsers}
          label="Registered Students"
          value={stats.registeredStudents}
          helpText="For placements"
        />
      </SimpleGrid>

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>All Opportunities</Tab>
          <Tab>Applied</Tab>
          <Tab>Upcoming Drives</Tab>
          <Tab>Past Drives</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {opportunities.map(opportunity => (
                <OpportunityCard
                  key={opportunity._id}
                  opportunity={opportunity}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          {/* Other tab panels */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PlacementHub;
\`\`\`

### 5.7 Resources Section
\`\`\`javascript
// ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Input,
  SimpleGrid, useToast, Select, IconButton,
  InputGroup, InputLeftElement, Flex, Badge,
  Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import {
  FiSearch, FiDownload, FiFilter,
  FiBook, FiFile, FiVideo, FiLink
} from 'react-icons/fi';
import axios from 'axios';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = async () => {
    try {
      const response = await axios.get(\`/api/resources?\${
        selectedCategory !== 'all' ? \`category=\${selectedCategory}\` : ''
      }\`, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setResources(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (resourceId) => {
    try {
      const response = await axios.get(\`/api/resources/\${resourceId}/download\`, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resource.pdf'); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resource",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const ResourceCard = ({ resource }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'document': return FiFile;
        case 'video': return FiVideo;
        case 'book': return FiBook;
        case 'link': return FiLink;
        default: return FiFile;
      }
    };

    const Icon = getIcon(resource.type);

    return (
      <Box
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        position="relative"
      >
        <Flex justify="space-between" align="start" mb={4}>
          <Flex align="center">
            <Icon size={24} />
            <VStack align="start" ml={3} spacing={1}>
              <Heading size="md">{resource.title}</Heading>
              <Text color="gray.500" fontSize="sm">
                {resource.category}
              </Text>
            </VStack>
          </Flex>
          <Badge colorScheme={resource.type === 'document' ? 'blue' : 'green'}>
            {resource.type}
          </Badge>
        </Flex>

        <Text noOfLines={2} mb={4} color="gray.600">
          {resource.description}
        </Text>

        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            Added {new Date(resource.createdAt).toLocaleDateString()}
          </Text>
          <Button
            leftIcon={<FiDownload />}
            colorScheme="blue"
            size="sm"
            onClick={() => handleDownload(resource._id)}
          >
            Download
          </Button>
        </Flex>
      </Box>
    );
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={8}>
      <Heading mb={6}>Learning Resources</Heading>

      <Flex mb={6} gap={4} wrap="wrap">
        <InputGroup maxW="400px">
          <InputLeftElement>
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW="200px"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
        </Select>

        <Menu>
          <MenuButton as={IconButton} icon={<FiFilter />} variant="outline" />
          <MenuList>
            <MenuItem>Sort by Date</MenuItem>
            <MenuItem>Sort by Name</MenuItem>
            <MenuItem>Sort by Size</MenuItem>
            <MenuItem>Filter by Type</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredResources.map(resource => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ResourcesPage;
\`\`\`

## 6. Security Implementation

### 6.1 JWT Authentication Middleware
\`\`\`javascript
// authMiddleware.js
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
\`\`\`

### 6.2 Password Encryption
\`\`\`javascript
// User.js Model
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
\`\`\`

## 7. Database Design

### 7.1 User Schema
\`\`\`javascript
// User.js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profilePic: String,
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }]
});
\`\`\`

### 7.2 Course Schema
\`\`\`javascript
// Course.js
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modules: [{
    title: String,
    lessons: [{
      title: String,
      content: String,
      resources: [String]
    }]
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
\`\`\`

## 8. UI/UX Design

### 8.1 Theme Configuration
\`\`\`javascript
// theme.js
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      900: '#0d47a1',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
  },
});
\`\`\`

### 8.2 Responsive Layout Components
\`\`\`javascript
// Layout.jsx
const Layout = ({ children }) => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {children}
        </SimpleGrid>
      </Container>
      <Footer />
    </Box>
  );
};
\`\`\`

## 9. Testing Implementation

### 9.1 Frontend Testing
\`\`\`javascript
// Login.test.js
describe('Login Component', () => {
  test('should handle login submission', async () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
\`\`\`

### 9.2 API Testing
\`\`\`javascript
// auth.test.js
describe('Auth API', () => {
  test('should authenticate user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
\`\`\`

## 10. Deployment Configuration

### 10.1 Production Setup
\`\`\`javascript
// server.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
\`\`\`

### 10.2 Environment Configuration
\`\`\`javascript
// config.js
module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};
\`\`\`

## Conclusion

This project demonstrates a comprehensive implementation of a modern e-learning platform, incorporating best practices in:
- Frontend development with React
- Backend API design with Node.js
- Database modeling with MongoDB
- Security implementation
- UI/UX design
- Testing and deployment

The modular architecture allows for easy maintenance and future enhancements, while the comprehensive feature set provides a robust learning experience for users. 