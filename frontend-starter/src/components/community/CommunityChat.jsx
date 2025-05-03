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
  Spinner,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast
} from '@chakra-ui/react';
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiUsers, 
  FiMoreVertical,
  FiArrowUp,
  FiFile,
  FiImage,
  FiLink
} from 'react-icons/fi';

const CommunityChat = ({ 
  community, 
  messages, 
  currentUser, 
  onSendMessage, 
  hasMoreMessages,
  onLoadMoreMessages,
  loadingMoreMessages,
  messagesEndRef,
  isConnected
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();
  
  // Get current user ID
  const currentUserId = currentUser?._id;
  
  // Format timestamp
  const formatTimestamp = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
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
  
  // Group messages by date and sender
  const groupedMessages = [];
  let currentDate = null;
  let currentSender = null;
  
  messages.forEach((msg, index) => {
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
      currentSender = null; // Reset sender after date change
    }
    
    // Check if we need to group with previous message
    const isSameSender = currentSender === msg.sender._id;
    const isPreviousRecent = index > 0 && 
      (new Date(msg.createdAt) - new Date(messages[index - 1].createdAt)) < 5 * 60 * 1000; // 5 minutes
    
    if (!isSameSender || !isPreviousRecent) {
      // Start a new message group
      groupedMessages.push({
        type: 'messageGroup',
        sender: msg.sender,
        messages: [msg],
        timestamp: new Date(msg.createdAt),
      });
      currentSender = msg.sender._id;
    } else {
      // Add to existing message group
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      lastGroup.messages.push(msg);
      lastGroup.timestamp = new Date(msg.createdAt);
    }
  });
  
  return (
    <Flex direction="column" h="75vh" borderWidth={1} borderRadius="md" overflow="hidden">
      {/* Header */}
      <Box p={3} bg="blue.500" color="white">
        <Flex justify="space-between" align="center">
          <HStack>
            <Avatar 
              size="sm" 
              name={community.name.substring(0, 2)} 
              src={community.avatar}
            />
            <Box>
              <Text fontWeight="bold">{community.name}</Text>
              <Flex align="center">
                <Icon as={FiUsers} fontSize="xs" mr={1} />
                <Text fontSize="xs">{community.members?.length || 0} members</Text>
                {!isConnected && (
                  <Badge ml={2} colorScheme="red" fontSize="xs">Offline</Badge>
                )}
              </Flex>
            </Box>
          </HStack>
          
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Community options"
              icon={<FiMoreVertical />}
              variant="ghost"
              color="white"
              _hover={{ bg: "blue.600" }}
            />
            <MenuList>
              <MenuItem>View Members</MenuItem>
              <MenuItem>Community Settings</MenuItem>
              <MenuItem color="red.500">Leave Community</MenuItem>
            </MenuList>
          </Menu>
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
        {/* Load More Messages Button */}
        {hasMoreMessages && (
          <Flex justify="center" mb={4}>
            <Button
              size="sm"
              leftIcon={loadingMoreMessages ? <Spinner size="xs" /> : <FiArrowUp />}
              onClick={onLoadMoreMessages}
              isDisabled={loadingMoreMessages}
              variant="outline"
            >
              {loadingMoreMessages ? 'Loading...' : 'Load earlier messages'}
            </Button>
          </Flex>
        )}
        
        {/* Messages Content */}
        <VStack spacing={3} align="stretch">
          {groupedMessages.length === 0 ? (
            <Flex direction="column" justify="center" align="center" h="200px">
              <Text color="gray.500">No messages yet</Text>
              <Text fontSize="sm" mt={2}>Be the first to send a message!</Text>
            </Flex>
          ) : (
            groupedMessages.map((group, index) => {
              if (group.type === 'date') {
                return (
                  <Flex key={`date-${index}`} align="center" justify="center" py={2}>
                    <Divider />
                    <Badge px={2} mx={2}>
                      {group.date}
                    </Badge>
                    <Divider />
                  </Flex>
                );
              } else {
                const isCurrentUser = group.sender._id === currentUserId;
                return (
                  <Box key={`msg-group-${index}`} mb={2}>
                    <HStack spacing={3} align="flex-start">
                      <Avatar 
                        size="sm" 
                        name={group.sender.name} 
                        src={group.sender.profilePicture}
                      />
                      <Box flex="1">
                        <Flex align="baseline">
                          <Text fontWeight="bold" fontSize="sm">
                            {group.sender.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500" ml={2}>
                            {formatTimestamp(group.timestamp)}
                          </Text>
                        </Flex>
                        
                        {group.messages.map((message, msgIndex) => (
                          <Box key={`msg-${message._id}-${msgIndex}`} mt={1}>
                            {message.content && (
                              <Text fontSize="sm">{message.content}</Text>
                            )}
                            
                            {/* Render attachments if any */}
                            {message.attachments && message.attachments.length > 0 && (
                              <Flex mt={1} flexWrap="wrap" gap={2}>
                                {message.attachments.map((attachment, attachIndex) => {
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
                          </Box>
                        ))}
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
                />
              </Flex>
            ))}
          </Flex>
        )}
      
        <Flex>
          <InputGroup size="md">
            <Input
              placeholder="Type a message..."
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
            You're currently offline. Messages can't be sent until the connection is restored.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default CommunityChat; 