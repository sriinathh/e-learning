import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  VStack,
  HStack,
  Divider,
  IconButton,
  Heading,
  Badge,
  useToast
} from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import { format, isToday, isYesterday } from 'date-fns';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { getDirectMessages, sendDirectMessage, getMockUsers } from '../utils/socketService';

const DirectMessage = ({ toUserId, toUserName, onClose }) => {
  const { currentUser } = useUser();
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  // Load direct messages
  useEffect(() => {
    if (!currentUser || !toUserId) return;
    
    setLoading(true);
    
    // Get the recipient user details
    const users = getMockUsers(currentUser.id);
    const foundRecipient = users.find(user => user.id === toUserId);
    if (foundRecipient) {
      setRecipient(foundRecipient);
    } else {
      setRecipient({
        id: toUserId,
        name: toUserName || 'User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(toUserName || 'User')}`
      });
    }
    
    // Get direct messages
    const initialMessages = getDirectMessages(currentUser.id, toUserId);
    setMessages(initialMessages || []);
    
    // Setup message listener
    const handleNewMessage = (newMsg) => {
      // Check if message belongs to this conversation
      const conversationId = [currentUser.id, toUserId].sort().join('-');
      if (newMsg.conversationId === conversationId) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(m => m.id === newMsg.id);
          if (exists) return prev;
          return [...prev, newMsg];
        });
      }
    };
    
    // Register for direct message events
    if (socket) {
      socket.on('direct_message_received', handleNewMessage);
      
      // Register for specific conversation updates
      const conversationId = [currentUser.id, toUserId].sort().join('-');
      socket.on(`direct_messages_${conversationId}`, (msgs) => {
        setMessages(msgs || []);
        setLoading(false);
      });
    }
    
    setLoading(false);
    
    return () => {
      // Cleanup listeners
      if (socket) {
        socket.off('direct_message_received');
        const conversationId = [currentUser.id, toUserId].sort().join('-');
        socket.off(`direct_messages_${conversationId}`);
      }
    };
  }, [currentUser, toUserId, toUserName, socket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!currentUser || !toUserId) {
      toast({
        title: 'Error',
        description: 'Could not send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    sendDirectMessage(currentUser.id, toUserId, { text: message.trim() });
    setMessage('');
  };

  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday ' + format(date, 'h:mm a');
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    
    groups[dateStr].push(message);
    return groups;
  }, {});

  return (
    <Box 
      height="100%" 
      display="flex" 
      flexDirection="column"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
    >
      {/* Header */}
      <Flex 
        p={4} 
        borderBottom="1px solid" 
        borderColor="gray.200"
        align="center"
        bg="blue.50"
      >
        <Avatar 
          size="md" 
          name={recipient?.name || "User"} 
          src={recipient?.avatar} 
          mr={3}
        />
        <Box>
          <Heading size="md">{recipient?.name || toUserName || "User"}</Heading>
          <Badge colorScheme={recipient?.status === 'online' ? 'green' : 'gray'}>
            {recipient?.status || 'offline'}
          </Badge>
        </Box>
        {onClose && (
          <IconButton 
            ml="auto"
            aria-label="Close conversation"
            icon={<span>×</span>}
            onClick={onClose}
          />
        )}
      </Flex>

      {/* Messages */}
      <Flex 
        flex="1" 
        direction="column" 
        overflowY="auto" 
        p={4}
        bg="gray.50"
      >
        {loading ? (
          <Text textAlign="center" py={4} color="gray.500">Loading messages...</Text>
        ) : messages.length === 0 ? (
          <Text textAlign="center" py={4} color="gray.500">
            No messages yet. Send a message to start the conversation.
          </Text>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs], groupIndex) => (
            <Box key={groupIndex} mb={4}>
              <Flex justify="center" mb={2}>
                <Text
                  fontSize="xs"
                  bg="gray.200"
                  px={2}
                  py={1}
                  borderRadius="full"
                  color="gray.600"
                >
                  {isToday(new Date(date)) 
                    ? 'Today' 
                    : isYesterday(new Date(date)) 
                    ? 'Yesterday' 
                    : format(new Date(date), 'MMMM d, yyyy')}
                </Text>
              </Flex>
              
              {msgs.map((msg, index) => (
                <HStack 
                  key={msg.id || index}
                  alignSelf={msg.sender.id === currentUser?.id ? 'flex-end' : 'flex-start'}
                  mb={2}
                  maxW="80%"
                  ml={msg.sender.id === currentUser?.id ? 'auto' : 0}
                >
                  {msg.sender.id !== currentUser?.id && (
                    <Avatar size="sm" name={msg.sender.name} src={msg.sender.avatar} />
                  )}
                  
                  <Box>
                    <Flex 
                      direction="column"
                      bg={msg.sender.id === currentUser?.id ? 'blue.500' : 'gray.200'} 
                      color={msg.sender.id === currentUser?.id ? 'white' : 'black'} 
                      p={3} 
                      borderRadius="lg"
                    >
                      <Text>{msg.text}</Text>
                    </Flex>
                    <Text 
                      fontSize="xs" 
                      color="gray.500" 
                      textAlign={msg.sender.id === currentUser?.id ? 'right' : 'left'}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Flex>

      {/* Message Input */}
      <Flex 
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        align="center"
      >
        <IconButton
          variant="ghost"
          colorScheme="blue"
          aria-label="Add attachment"
          icon={<FiPaperclip />}
          mr={2}
        />
        <IconButton
          variant="ghost"
          colorScheme="blue"
          aria-label="Add emoji"
          icon={<FiSmile />}
          mr={2}
        />
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          mr={2}
        />
        <Button
          colorScheme="blue"
          onClick={handleSendMessage}
          isDisabled={!message.trim()}
          leftIcon={<FiSend />}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default DirectMessage; 