import React, { useState, useRef, useEffect } from 'react';

import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  IconButton,
  Button,
  Flex,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Image,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiFile,
  FiDownload,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiUsers
} from 'react-icons/fi';

const Message = ({ message, currentUser }) => {
  const isCurrentUser = message.sender?._id === currentUser?.id;
  const bgColor = useColorModeValue(
    isCurrentUser ? 'blue.100' : 'gray.100',
    isCurrentUser ? 'blue.800' : 'gray.700'
  );
  const textColor = useColorModeValue(
    isCurrentUser ? 'gray.800' : 'gray.800',
    isCurrentUser ? 'white' : 'white'
  );

  const renderAttachment = () => {
    if (!message.attachment) return null;

    const { type, url, name, size } = message.attachment;

    if (type.startsWith('image/')) {
      return (
        <Image 
          src={url} 
          maxH="200px" 
          borderRadius="md" 
          mb={2} 
          objectFit="cover"
          onClick={() => window.open(url, '_blank')}
          cursor="pointer"
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <Box mb={2} borderRadius="md" overflow="hidden" maxW="300px">
          <video controls width="100%">
            <source src={url} type={type} />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    // For other file types
    return (
      <Flex 
        p={3} 
        bg={useColorModeValue('gray.50', 'gray.700')} 
        borderRadius="md" 
        mb={2}
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        align="center"
      >
        <Box 
          p={2} 
          borderRadius="md" 
          bg={useColorModeValue('blue.50', 'blue.900')} 
          color="blue.500"
          mr={3}
        >
          <Icon as={FiFile} boxSize={6} />
        </Box>
        <Box flex={1}>
          <Text fontWeight="medium" fontSize="sm" noOfLines={1}>{name}</Text>
          <Text fontSize="xs" color="gray.500">{(size / 1024).toFixed(1)} KB</Text>
        </Box>
        <IconButton 
          icon={<FiDownload />} 
          size="sm" 
          variant="ghost" 
          aria-label="Download file" 
          as="a"
          href={url}
          download={name}
        />
      </Flex>
    );
  };

  return (
    <Flex
      justify={isCurrentUser ? 'flex-end' : 'flex-start'}
      mb={6}
      px={6}
      w="100%"
    >
      {!isCurrentUser && (
        <Avatar 
          size="md" 
          name={message.sender?.name} 
          src={message.sender?.avatar} 
          mr={3} 
          mt={1}
        />
      )}

      <Flex 
        maxW={{ base: "85%", md: "75%" }}
        direction="column"
        align={isCurrentUser ? 'flex-end' : 'flex-start'}
      >
        {!isCurrentUser && (
          <Text fontSize="sm" fontWeight="bold" mb={1} color="gray.500">
            {message.sender?.name}
          </Text>
        )}

        <Box>
          {renderAttachment()}

          {message.content && (
            <Box
              px={5}
              py={3}
              bg={bgColor}
              color={textColor}
              borderRadius="lg"
              boxShadow="sm"
              fontSize="md"
            >
              <Text>{message.content}</Text>
            </Box>
          )}

          <HStack spacing={1} mt={1} justify={isCurrentUser ? 'flex-end' : 'flex-start'}>
            <Text fontSize="xs" color="gray.500">
              {message.createdAt || '12:00 PM'}

              
            </Text>

            {isCurrentUser && (
              <Icon 
                as={message.isRead ? FiCheckCircle : FiCheck} 
                color={message.isRead ? 'blue.500' : 'gray.500'} 
                boxSize={3} 
              />
            )}
          </HStack>
        </Box>
      </Flex>

      {isCurrentUser && (
        <Avatar 
          size="md" 
          name={currentUser?.name} 
          src={currentUser?.avatar} 
          ml={3} 
          mt={1}
        />
      )}
    </Flex>
  );
};

const ChatArea = ({ currentGroup, messages, onSendMessage, currentUser }) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() || attachments.length > 0) {
      onSendMessage({
        content: messageText,
        attachments
      });
      setMessageText('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAttachments(prev => [...prev, {
          type: file.type,
          url: reader.result,
          name: file.name,
          size: file.size
        }]);
      };

      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Flex 
      flex="1"
      height="100%"
      direction="column" 
      bg="white" 
      borderLeft="1px" 
      borderColor="gray.200"
      overflow="hidden"
      className="community-chat-container"
    >
      {currentGroup ? (
        <>
          {/* Chat Header */}
          <Flex 
            px={8} 
            py={4} 
            borderBottom="1px solid" 
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
            align="center"
          >
            <Avatar 
              size="md" 
              name={currentGroup.name} 
              src={currentGroup.avatar} 
              bg={`${currentGroup.color}.400`}
              mr={4}
            />

            <Box flex={1}>
              <HStack>
                <Text fontWeight="bold" fontSize="lg">{currentGroup.name}</Text>
                <Badge colorScheme={currentGroup.isPrivate ? 'red' : 'green'} ml={1}>
                  {currentGroup.isPrivate ? 'Private' : 'Public'}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {currentGroup.memberCount || (currentGroup.members || []).length} members • {currentGroup.activeUsers || 0} online
              </Text>
            </Box>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                aria-label="More options"
              />
              <MenuList>
                <MenuItem>View Group Info</MenuItem>
                <MenuItem>Add Member</MenuItem>
                <MenuItem>Search in Chat</MenuItem>
                <Divider />
                <MenuItem color="red.500">
                  {currentGroup.isMember ? 'Leave Group' : 'Report Group'}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {/* Messages Area */}
          <Box 
            flex={1}
            overflowY="auto"
            py={6}
            px={2}
          >
            {messages.length === 0 ? (
              <Flex direction="column" align="center" justify="center" h="100%" p={10}>
                <Avatar 
                  size="xl" 
                  icon={<FiMessageSquare />} 
                  mb={4}
                  bg={useColorModeValue('blue.400', 'blue.600')}
                />
                <Text fontSize="xl" color="gray.500">No messages yet...</Text>
              </Flex>
            ) : (
              <VStack align="stretch" spacing={4}>
                {messages.map((message, idx) => (
                  <Message 
                    key={idx} 
                    message={message} 
                    currentUser={currentUser} 
                  />
                ))}
              </VStack>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input Area */}
          <Box 
            p={4}
            borderTop="1px solid" 
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg={bgColor}
          >
            <HStack>
              <InputGroup>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  variant="filled"
                  borderRadius="full"
                  pr="4.5rem"
                />
                <InputRightElement>
                  <HStack spacing={4}>
                    <Tooltip label="Attach file">
                      <IconButton
                        icon={<FiPaperclip />}
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Attach file"
                      />
                    </Tooltip>
                    <Tooltip label="Send message">
                      <IconButton
                        icon={<FiSend />}
                        variant="solid"
                        colorScheme="blue"
                        onClick={handleSendMessage}
                        aria-label="Send message"
                      />
                    </Tooltip>
                  </HStack>
                </InputRightElement>
              </InputGroup>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
              />
            </HStack>
          </Box>
        </>
      ) : (
        <Flex 
          justify="center" 
          align="center" 
          height="100%" 
          p={10} 
          direction="column"
        >
          <Text fontSize="lg" color="gray.500">Select a group to start chatting</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ChatArea;
