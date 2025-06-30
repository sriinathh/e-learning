import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Input, 
  Button, 
  Avatar, 
  VStack,
  HStack,
  IconButton,
  Heading,
  Divider,
  useToast,
  Tooltip,
  Badge,
  Spinner,
  Image
} from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiImage, FiSmile, FiMoreHorizontal, FiUser, FiUsers, FiInfo, FiCalendar } from 'react-icons/fi';
import { getMockMessages } from '../utils/socketService';

const ChatArea = ({ socket, community, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [showCommunityInfo, setShowCommunityInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  
  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load messages when community changes
  useEffect(() => {
    if (socket && community) {
      setIsLoading(true);
      setMessages([]); // Clear messages when community changes
      
      // Request message history
      socket.emit('get_community_messages', { communityId: community.id });
      
      // Listen for message history
      socket.on(`community_messages_${community.id}`, (messageHistory) => {
        setMessages(messageHistory);
        setIsLoading(false);
        scrollToBottom();
      });
      
      // If no response in 2 seconds, use mock data
      const timeout = setTimeout(() => {
        if (isLoading) {
          const mockMsgs = getMockMessages().map(msg => ({
            ...msg,
            communityId: community.id
          }));
          setMessages(mockMsgs);
          setIsLoading(false);
          scrollToBottom();
        }
      }, 2000);
      
      // Listen for new messages
      socket.on('receive_message', (message) => {
        if (message.communityId === community.id) {
          console.log('Received message for community:', message);
          setMessages(prevMessages => [...prevMessages, message]);
        }
      });
      
      // Listen for typing events
      socket.on('user_typing', ({ userId, userName, communityId }) => {
        if (userId !== user.id && communityId === community.id) {
          setTypingUsers(prev => {
            if (!prev.find(u => u.id === userId)) {
              return [...prev, { id: userId, name: userName }];
            }
            return prev;
          });
          
          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u.id !== userId));
          }, 3000);
        }
      });
      
      return () => {
        clearTimeout(timeout);
        socket.off(`community_messages_${community.id}`);
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [socket, community, user.id]);
  
  // Handle sending messages
  const handleSendMessage = () => {
    if ((!newMessage.trim() && attachments.length === 0) || !socket || !community || isSending) return;
    
    setIsSending(true);
    
    const messageData = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      communityId: community.id,
      timestamp: new Date().toISOString(),
      attachments: attachments
    };
    
    // Emit message to server
    socket.emit('send_message', messageData);
    
    // Reset inputs
    setNewMessage('');
    setAttachments([]);
    setIsSending(false);
  };
  
  // Handle typing event
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && socket && community) {
      setIsTyping(true);
      socket.emit('typing', { 
        userId: user.id, 
        userName: user.name,
        communityId: community.id 
      });
      
      // Reset typing status after 3 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  };
  
  // Handle attachment selection
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Mock file upload - in a real app, you'd upload to server
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random().toString(36).substring(2),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      setAttachments([...attachments, ...newAttachments]);
      
      toast({
        title: 'File attached',
        description: `${files.length} file(s) ready to send`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Box position="relative" h="100%">
      {/* Chat header */}
      <Flex 
        p={4} 
        bg="white" 
        borderBottomWidth="1px" 
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <HStack spacing={3}>
          <Avatar 
            size="md" 
            name={community?.name} 
            src={community?.photo}
            bg="teal.500"
          />
          <Box>
            <Heading size="md">{community?.name}</Heading>
            <HStack spacing={2} color="gray.500" fontSize="sm">
              <FiUsers />
              <Text>{community?.members} members</Text>
              {community?.createdAt && (
                <>
                  <Text>•</Text>
                  <FiCalendar size={14} />
                  <Text>Created {formatDate(community.createdAt)}</Text>
                </>
              )}
            </HStack>
          </Box>
        </HStack>
        
        <HStack>
          <Badge colorScheme="green" px={2} py={1} borderRadius="full">
            {community?.isJoined ? 'Joined' : 'Not Joined'}
          </Badge>
          <Tooltip label="Community info">
            <IconButton
              icon={<FiInfo />}
              variant="ghost"
              aria-label="Community info"
              onClick={() => setShowCommunityInfo(!showCommunityInfo)}
            />
          </Tooltip>
        </HStack>
      </Flex>
      
      {/* Community info drawer */}
      {showCommunityInfo && (
        <Box 
          position="absolute" 
          top="73px" 
          right="0" 
          w="300px" 
          bg="white" 
          zIndex="10"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.200"
          p={4}
          borderBottomLeftRadius="md"
        >
          <VStack align="start" spacing={4}>
            <Heading size="sm">About this community</Heading>
            {community?.description && (
              <Text fontSize="sm">{community.description}</Text>
            )}
            <Divider />
            <HStack>
              <FiUsers />
              <Text fontSize="sm">{community?.members} members</Text>
            </HStack>
            {community?.createdAt && (
              <HStack>
                <FiCalendar />
                <Text fontSize="sm">Created on {formatDate(community.createdAt)}</Text>
              </HStack>
            )}
            {community?.createdBy && (
              <HStack>
                <FiUser />
                <Text fontSize="sm">Created by {community.createdBy === user.id ? 'you' : 'another user'}</Text>
              </HStack>
            )}
          </VStack>
        </Box>
      )}
      
      {/* Messages area */}
      <Box className="message-list">
        {isLoading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : (
          <VStack spacing={6} align="stretch">
            {/* Grouped messages by date */}
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <Box key={date}>
                <Flex justify="center" my={4}>
                  <Badge px={2} py={1} borderRadius="full" bg="gray.100">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Badge>
                </Flex>
                
                <VStack spacing={4} align="stretch">
                  {dateMessages.map((message) => {
                    const isSentByMe = message.sender.id === user.id;
                    
                    return (
                      <Flex 
                        key={message.id} 
                        className="message-item"
                        justify={isSentByMe ? "flex-end" : "flex-start"}
                      >
                        {/* Horizontal message layout */}
                        <Flex 
                          maxW="70%" 
                          direction="row" 
                          alignItems="flex-start"
                        >
                          {/* Avatar - only show for received messages */}
                          {!isSentByMe && (
                            <Avatar 
                              size="sm" 
                              name={message.sender.name} 
                              src={message.sender.avatar} 
                              mr={2}
                              mt={1}
                            />
                          )}
                          
                          <Box>
                            {/* Sender name - only for received messages */}
                            {!isSentByMe && (
                              <Text fontSize="xs" fontWeight="bold" ml={1} mb={1}>
                                {message.sender.name}
                              </Text>
                            )}
                            
                            <Box 
                              className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}
                              boxShadow="sm"
                            >
                              <Text>{message.text}</Text>
                              
                              {/* Display attachments if any */}
                              {message.attachments && message.attachments.length > 0 && (
                                <VStack mt={2} spacing={1} align="stretch">
                                  {message.attachments.map(file => (
                                    <Box 
                                      key={file.id}
                                      p={2}
                                      bg="gray.50"
                                      borderRadius="md"
                                      fontSize="sm"
                                    >
                                      <Text>{file.name}</Text>
                                      {file.type.startsWith('image/') && file.url && (
                                        <Box mt={2}>
                                          <Image 
                                            src={file.url} 
                                            alt={file.name}
                                            borderRadius="md"
                                            maxH="200px"
                                            objectFit="cover"
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                                </VStack>
                              )}
                              
                              <Text className="message-time">
                                {formatTime(message.timestamp)}
                              </Text>
                            </Box>
                          </Box>
                        </Flex>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>
            ))}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <HStack className="typing-indicator">
                <Text fontSize="xs">{typingUsers[0].name} is typing</Text>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </HStack>
            )}
            
            {/* Anchor for auto-scrolling */}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>
      
      {/* Message input */}
      {community?.isJoined ? (
        <Box className="message-input-container">
          {/* Display selected attachments */}
          {attachments.length > 0 && (
            <Flex wrap="wrap" mb={2}>
              {attachments.map(file => (
                <Badge 
                  key={file.id} 
                  colorScheme="teal" 
                  m={1} 
                  p={2} 
                  borderRadius="full"
                >
                  {file.name}
                </Badge>
              ))}
            </Flex>
          )}
          
          <Flex position="relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              pr="4.5rem"
              className="message-input"
            />
            
            <HStack position="absolute" right="0" h="100%" pr={2}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
              />
              
              <Tooltip label="Attach files">
                <IconButton
                  icon={<FiPaperclip />}
                  aria-label="Attach files"
                  variant="ghost"
                  onClick={handleAttachmentClick}
                />
              </Tooltip>
              
              <Tooltip label="Send message">
                <IconButton
                  icon={<FiSend />}
                  colorScheme="teal"
                  variant="solid"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  isLoading={isSending}
                  className="send-button"
                />
              </Tooltip>
            </HStack>
          </Flex>
        </Box>
      ) : (
        <Flex 
          p={4} 
          bg="gray.50" 
          borderTopWidth="1px" 
          borderColor="gray.200"
          justify="center"
        >
          <Text color="gray.500">Join this community to send messages</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatArea; 