import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Avatar,
  Input,
  Button,
  IconButton,
  Divider,
  Badge,
  Icon,
  InputGroup,
  InputRightElement,
  useToast
} from '@chakra-ui/react';
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiMoreVertical,
  FiFile,
  FiImage
} from 'react-icons/fi';

const DirectMessaging = ({ 
  recipient, 
  messages, 
  currentUser, 
  onSendMessage,
  messagesEndRef,
  isConnected
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();
  
  // Format timestamp
  const formatTimestamp = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatMessageDate = (date) => {
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
      return messageDate.toLocaleDateString();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast({
        title: 'Too many files',
        description: 'You can upload a maximum of 5 files at once',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'Files too large',
        description: 'Total file size should not exceed 10MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setAttachments(files);
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if ((!message || message.trim() === '') && attachments.length === 0) return;
    
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
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
  
  // Group messages by date
  const groupedMessages = [];
  let currentDate = null;
  
  messages.forEach((msg) => {
    const messageDate = new Date(msg.createdAt);
    const formattedDate = formatMessageDate(msg.createdAt);
    
    // Add date separator if needed
    if (formattedDate !== currentDate) {
      groupedMessages.push({
        type: 'date',
        date: formattedDate,
        timestamp: messageDate,
      });
      currentDate = formattedDate;
    }
    
    // Add message
    groupedMessages.push({
      type: 'message',
      ...msg
    });
  });
  
  return (
    <Flex direction="column" h="75vh" borderWidth={1} borderRadius="md" overflow="hidden">
      {/* Header */}
      <Box p={3} bg="blue.500" color="white">
        <Flex justify="space-between" align="center">
          <HStack>
            <Box position="relative">
              <Avatar 
                size="sm" 
                name={recipient.name} 
                src={recipient.profilePicture}
              />
              {recipient.isOnline && (
                <Box 
                  position="absolute" 
                  bottom="0" 
                  right="0"
                  bg="green.400" 
                  borderRadius="full" 
                  boxSize="8px" 
                  borderWidth="1.5px" 
                  borderColor="blue.500" 
                />
              )}
            </Box>
            <Box>
              <Text fontWeight="bold">{recipient.name}</Text>
              <Flex align="center">
                <Text fontSize="xs">
                  {recipient.isOnline ? 'Online' : 'Offline'}
                </Text>
                {!isConnected && (
                  <Badge ml={2} colorScheme="red" fontSize="xs">Connection Lost</Badge>
                )}
              </Flex>
            </Box>
          </HStack>
        </Flex>
      </Box>
      
      {/* Messages Area */}
      <Box 
        flex="1" 
        overflowY="auto" 
        bg="white" 
        p={3}
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
          {groupedMessages.length === 0 ? (
            <Flex direction="column" justify="center" align="center" h="200px">
              <Text color="gray.500">No messages yet</Text>
              <Text fontSize="sm" mt={2}>Start a conversation with {recipient.name}!</Text>
            </Flex>
          ) : (
            groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return (
                  <Flex key={`date-${index}`} align="center" justify="center" py={2}>
                    <Divider />
                    <Badge px={2} mx={2}>
                      {item.date}
                    </Badge>
                    <Divider />
                  </Flex>
                );
              } else {
                const isCurrentUser = item.sender._id === currentUser._id;
                return (
                  <Box key={`msg-${item._id}`} mb={2}>
                    <Flex 
                      justify={isCurrentUser ? 'flex-end' : 'flex-start'} 
                      mb={1}
                    >
                      {!isCurrentUser && (
                        <Avatar 
                          size="xs" 
                          name={item.sender.name} 
                          src={item.sender.profilePicture}
                          mr={2}
                          mt={1}
                        />
                      )}
                      
                      <Flex 
                        direction="column" 
                        maxW="70%" 
                        bg={isCurrentUser ? 'blue.50' : 'gray.100'}
                        color={isCurrentUser ? 'gray.800' : 'gray.800'}
                        borderRadius="lg"
                        p={2}
                        borderTopLeftRadius={!isCurrentUser ? 0 : undefined}
                        borderTopRightRadius={isCurrentUser ? 0 : undefined}
                      >
                        {item.content && (
                          <Text fontSize="sm">{item.content}</Text>
                        )}
                        
                        {/* Render attachments if any */}
                        {item.attachments && item.attachments.length > 0 && (
                          <Flex mt={1} flexWrap="wrap" gap={2}>
                            {item.attachments.map((attachment, attachIndex) => {
                              if (attachment.type === 'image') {
                                return (
                                  <Box 
                                    key={`attach-${attachIndex}`} 
                                    borderWidth={1} 
                                    borderRadius="md" 
                                    overflow="hidden"
                                    maxW="200px"
                                  >
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name || 'Attached image'} 
                                      style={{ maxWidth: '100%' }} 
                                    />
                                  </Box>
                                );
                              } else {
                                return (
                                  <Button
                                    key={`attach-${attachIndex}`}
                                    as="a"
                                    href={attachment.url}
                                    target="_blank"
                                    size="sm"
                                    leftIcon={<FiFile />}
                                    variant="outline"
                                  >
                                    {attachment.name || 'Attachment'}
                                    {attachment.size && (
                                      <Text ml={1} fontSize="xs" color="gray.500">
                                        ({Math.round(attachment.size / 1024)} KB)
                                      </Text>
                                    )}
                                  </Button>
                                );
                              }
                            })}
                          </Flex>
                        )}
                        
                        <Text fontSize="xs" color="gray.500" alignSelf={isCurrentUser ? 'flex-start' : 'flex-end'}>
                          {formatTimestamp(item.createdAt)}
                          {item.isEdited && ' (edited)'}
                          {!item.read && isCurrentUser && ' ✓'}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                );
              }
            })
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      
      {/* Message Input */}
      <Box p={3} bg="gray.50" borderTopWidth={1}>
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <Flex mb={2} overflowX="auto" gap={2} pb={2}>
            {attachments.map((file, index) => (
              <Flex 
                key={`preview-${index}`}
                align="center"
                borderWidth={1}
                borderRadius="md"
                p={1}
                bg="white"
              >
                <Icon 
                  as={file.type.startsWith('image/') ? FiImage : FiFile} 
                  mr={1}
                  color="blue.500"
                />
                <Text fontSize="xs" noOfLines={1} maxW="150px">
                  {file.name}
                </Text>
                <IconButton
                  icon={<Icon as={FiMoreVertical} />}
                  size="xs"
                  variant="ghost"
                  ml={1}
                  onClick={() => {
                    setAttachments(attachments.filter((_, i) => i !== index));
                  }}
                  isDisabled={!isConnected}
                />
              </Flex>
            ))}
          </Flex>
        )}
      
        <Flex>
          <InputGroup size="md">
            <Input
              placeholder={`Message ${recipient.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              bg="white"
              borderRightRadius={0}
              isDisabled={!isConnected}
            />
            <InputRightElement width="auto">
              <HStack spacing={1} mr={1}>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={!isConnected}
                />
                <IconButton
                  aria-label="Attach files"
                  icon={<FiPaperclip />}
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  isDisabled={!isConnected}
                />
                <IconButton
                  aria-label="Insert emoji"
                  icon={<FiSmile />}
                  size="sm"
                  variant="ghost"
                  isDisabled={!isConnected}
                />
              </HStack>
            </InputRightElement>
          </InputGroup>
          <Button
            colorScheme="blue"
            borderLeftRadius={0}
            onClick={handleSendMessage}
            leftIcon={<FiSend />}
            isDisabled={!isConnected}
          >
            Send
          </Button>
        </Flex>
        {!isConnected && (
          <Text fontSize="xs" color="red.500" mt={2} textAlign="center">
            Connection to server lost. Messages can't be sent until connection is restored.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default DirectMessaging; 