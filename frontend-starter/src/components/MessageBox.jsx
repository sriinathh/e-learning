import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Spinner,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const MessageBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { socket, isConnected, sendMessage } = useSocket();

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5001';
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get('/api/chat/messages');
      setMessages(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to access messages',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch messages',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post('/api/chat/messages', {
        content: newMessage,
      });
      
      // Add message to local state
      setMessages([...messages, response.data]);
      
      // Send message through socket
      if (isConnected) {
        sendMessage({
          content: newMessage,
          timestamp: new Date().toISOString(),
          isAdmin: false,
        });
      }
      
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to send messages',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to access messages',
        status: 'warning',
        duration: 3000,
      });
      navigate('/login');
      return;
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (initialLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Messages
          {!isConnected && (
            <Text fontSize="sm" color="red.500">
              (Offline - Messages will be sent when reconnected)
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" h="60vh">
            <Box
              flex="1"
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray.200',
                  borderRadius: '24px',
                },
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  bg={message.isAdmin ? 'blue.50' : 'gray.50'}
                  p={3}
                  borderRadius="md"
                  mb={2}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={message.isAdmin ? 'Admin' : 'You'}
                      src={message.isAdmin ? '/admin-avatar.png' : undefined}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">
                        {message.isAdmin ? 'Admin' : 'You'}
                      </Text>
                      <Text>{message.content}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <form onSubmit={handleSendMessage}>
              <HStack>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading || !isConnected}
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  disabled={!newMessage.trim() || !isConnected}
                >
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MessageBox; 