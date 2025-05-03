import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  IconButton,
  Flex,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Divider,
  Button
} from '@chakra-ui/react';
import { FiSend, FiInfo, FiUsers } from 'react-icons/fi';

// Simple Message component
const Message = ({ message, currentUser }) => {
  const isCurrentUser = message.sender._id === currentUser.id;
  const bgColor = useColorModeValue(
    isCurrentUser ? 'blue.100' : 'gray.100',
    isCurrentUser ? 'blue.800' : 'gray.700'
  );
  const textColor = useColorModeValue(
    isCurrentUser ? 'gray.800' : 'gray.800',
    isCurrentUser ? 'white' : 'white'
  );
  
  return (
    <Flex
      justify={isCurrentUser ? 'flex-end' : 'flex-start'}
      mb={4}
      px={4}
      w="100%"
    >
      {!isCurrentUser && (
        <Avatar 
          size="sm" 
          name={message.sender.name} 
          src={message.sender.avatar} 
          mr={2} 
        />
      )}
      
      <Flex 
        maxW="70%" 
        direction="column"
      >
        {!isCurrentUser && (
          <Text fontSize="xs" fontWeight="medium" mb={1} ml={1}>
            {message.sender.name}
          </Text>
        )}
        
        <Box
          px={4}
          py={2}
          bg={bgColor}
          color={textColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Text>{message.content}</Text>
        </Box>
        
        <Text fontSize="xs" color="gray.500" mt={1} textAlign={isCurrentUser ? 'right' : 'left'}>
          {message.timestamp instanceof Date 
            ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''}
        </Text>
      </Flex>
      
      {isCurrentUser && (
        <Avatar 
          size="sm" 
          name={currentUser.name} 
          src={currentUser.avatar} 
          ml={2} 
        />
      )}
    </Flex>
  );
};

// Group info header
const GroupInfoHeader = ({ group, onLeaveGroup }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex 
      p={4} 
      bg={bgColor} 
      borderBottomWidth="1px" 
      borderColor={borderColor}
      align="center"
      justify="space-between"
    >
      <Flex align="center">
        <Avatar 
          size="sm" 
          name={group.name} 
          src={group.avatar} 
          bg={`${group.color}.500`}
          mr={3}
        />
        <Box>
          <Flex align="center">
            <Text fontWeight="bold">{group.name}</Text>
            <Text fontSize="xs" color="gray.500" ml={2}>
              {group.memberCount} members • {group.activeUsers} online
            </Text>
          </Flex>
          <Text fontSize="xs" color="gray.500">{group.description}</Text>
        </Box>
      </Flex>
      
      <HStack>
        <Button 
          size="sm" 
          leftIcon={<FiUsers />} 
          variant="ghost"
          colorScheme="blue"
        >
          Members
        </Button>
        <Button 
          size="sm" 
          leftIcon={<FiInfo />} 
          variant="ghost" 
          colorScheme="blue"
        >
          Info
        </Button>
      </HStack>
    </Flex>
  );
};

const ChatAreaSimple = ({ group, messages, onSendMessage, currentUser, onLeaveGroup }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage({ text: messageText });
      setMessageText('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Flex flex="1" direction="column" h="100%" overflow="hidden">
      {/* Group Info Header */}
      <GroupInfoHeader group={group} onLeaveGroup={onLeaveGroup} />
      
      {/* Messages Area */}
      <Box 
        flex="1" 
        overflowY="auto"
        bg={useColorModeValue('gray.50', 'gray.900')}
        py={4}
      >
        <VStack spacing={0} align="stretch">
          {messages.map((message, index) => (
            <Message 
              key={message._id || index} 
              message={message} 
              currentUser={currentUser} 
            />
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      
      {/* Message Input */}
      <Box 
        p={4} 
        bg={useColorModeValue('white', 'gray.800')}
        borderTopWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <InputGroup size="md">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            pr="4.5rem"
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="none"
            _focus={{
              bg: useColorModeValue('white', 'gray.600'),
              boxShadow: 'outline'
            }}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              icon={<FiSend />}
              colorScheme="blue"
              isDisabled={!messageText.trim()}
              onClick={handleSendMessage}
              aria-label="Send message"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
};

export default ChatAreaSimple; 