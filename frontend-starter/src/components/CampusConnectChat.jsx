import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Flex,
  IconButton,
  Divider,
  Spinner,
  useToast,
  Textarea,
  Container,
  Badge,
  useColorModeValue,
  Heading
} from '@chakra-ui/react';
import { FiSend, FiUser, FiCpu, FiTrash2, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const CampusConnectChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am CampusConnect, your educational assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 'default', title: 'New Conversation', messages: [] }
  ]);
  const [activeConversation, setActiveConversation] = useState('default');
  const endOfMessagesRef = useRef(null);
  const toast = useToast();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const sidePanelBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userBubbleBg = useColorModeValue('blue.500', 'blue.400');
  const aiBubbleBg = useColorModeValue('gray.100', 'gray.700');

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    
    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to backend API
      const response = await axios.post('http://localhost:5000/api/chat/campusconnect', {
        messages: [...messages, userMessage]
      });

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // More informative error messages based on the error type
      const errorDetails = error.response?.data?.details || '';
      const errorMessage = error.response?.data?.message || 'Could not connect to AI service';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // Add error message
      let assistantErrorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      // Special handling for API key errors
      if (error.response?.status === 401) {
        assistantErrorMessage = 
          "Error: The AI service is not configured properly. An administrator needs to set up the Mistral API key.\n\n" +
          "This typically requires:\n" +
          "1. Creating an account at https://console.mistral.ai/\n" +
          "2. Generating an API key\n" +
          "3. Adding it to the .env file in the backend";
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantErrorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    const newId = Date.now().toString();
    setConversations([
      ...conversations,
      { id: newId, title: 'New Conversation', messages: [] }
    ]);
    setActiveConversation(newId);
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am CampusConnect, your educational assistant. How can I help you today?'
    }]);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am CampusConnect, your educational assistant. How can I help you today?'
    }]);
  };

  return (
    <Flex 
      h="100%" 
      w="100%" 
      direction={{ base: 'column', md: 'row' }}
    >
      {/* Sidebar with conversation history */}
      <Box 
        w={{ base: 'full', md: '250px' }} 
        h="100%"
        bg={sidePanelBg} 
        p={3} 
        overflowY="auto"
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: 'none', md: 'block' }}
      >
        <VStack spacing={2} align="stretch">
          <Button 
            colorScheme="teal" 
            leftIcon={<FiCpu />} 
            justifyContent="flex-start"
            onClick={startNewConversation}
            mb={2}
          >
            New Conversation
          </Button>
          
          <Divider mb={2} />
          
          <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>Recent conversations</Text>
          
          {conversations.map(conv => (
            <Button
              key={conv.id}
              variant={activeConversation === conv.id ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              leftIcon={<FiChevronRight />}
              size="sm"
              onClick={() => setActiveConversation(conv.id)}
              isTruncated
            >
              {conv.title}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* Main chat area */}
      <Flex 
        flex={1} 
        direction="column" 
        bg={bgColor} 
        h="100%"
        overflowY="hidden"
      >
        {/* Chat header */}
        <Flex 
          p={3} 
          borderBottom="1px" 
          borderColor={borderColor} 
          align="center"
          justify="space-between"
        >
          <Flex align="center">
            <Avatar 
              size="sm" 
              bg="teal.500" 
              icon={<FiCpu fontSize="1.2rem" />} 
              mr={2} 
            />
            <Box>
              <Heading as="h2" size="sm">CampusConnect</Heading>
              <Badge colorScheme="teal" variant="subtle">AI Assistant</Badge>
            </Box>
          </Flex>
          
          <IconButton
            icon={<FiTrash2 />}
            variant="ghost"
            aria-label="Clear chat"
            onClick={clearChat}
          />
        </Flex>

        {/* Messages area */}
        <VStack 
          flex={1} 
          spacing={3}
          p={4}
          align="stretch" 
          overflowY="auto" 
          css={{
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.300', borderRadius: '8px' }
          }}
        >
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              w="100%"
            >
              <Flex
                maxW={{ base: '90%', md: '70%' }}
                bg={msg.role === 'user' ? userBubbleBg : aiBubbleBg}
                color={msg.role === 'user' ? 'white' : 'inherit'}
                p={3}
                borderRadius="lg"
                alignItems="flex-start"
              >
                {msg.role === 'assistant' && (
                  <Avatar 
                    size="sm" 
                    bg="teal.500"
                    icon={<FiCpu fontSize="1.2rem" />} 
                    mr={2} 
                  />
                )}
                <Box>
                  <Text whiteSpace="pre-wrap">{msg.content}</Text>
                </Box>
                {msg.role === 'user' && (
                  <Avatar 
                    size="sm" 
                    bg="blue.500"
                    icon={<FiUser fontSize="1.2rem" />} 
                    ml={2} 
                  />
                )}
              </Flex>
            </Flex>
          ))}
          {isLoading && (
            <Flex justify="flex-start" w="100%">
              <Flex
                bg={aiBubbleBg}
                p={3}
                borderRadius="lg"
                alignItems="center"
              >
                <Avatar 
                  size="sm" 
                  bg="teal.500"
                  icon={<FiCpu fontSize="1.2rem" />} 
                  mr={2} 
                />
                <Spinner size="sm" color="teal.500" />
              </Flex>
            </Flex>
          )}
          <div ref={endOfMessagesRef} />
        </VStack>

        {/* Input area */}
        <Box p={3} borderTop="1px" borderColor={borderColor}>
          <form onSubmit={handleSendMessage}>
            <HStack>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                resize="none"
                rows={1}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <IconButton 
                icon={<FiSend />} 
                colorScheme="teal" 
                type="submit"
                isLoading={isLoading}
                aria-label="Send message"
              />
            </HStack>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CampusConnectChat; 