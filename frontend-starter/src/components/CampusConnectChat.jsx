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
  Heading,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip
} from '@chakra-ui/react';
import { FiSend, FiUser, FiCpu, FiTrash2, FiChevronRight, FiSettings, FiSave } from 'react-icons/fi';
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
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [customInstructions, setCustomInstructions] = useState('');
  const [showTemperatureTooltip, setShowTemperatureTooltip] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const endOfMessagesRef = useRef(null);
  const toast = useToast();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const sidePanelBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userBubbleBg = useColorModeValue('blue.500', 'blue.400');
  const aiBubbleBg = useColorModeValue('gray.100', 'gray.700');

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available models from the backend
  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/chat/models');
      if (response.data.success) {
        setAvailableModels(response.data.models);
        setSelectedModel(response.data.defaultModel);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // If we can't fetch models, set a default
      setSelectedModel('mistral-small-latest');
    }
  };

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
      // Send to backend API with model parameters
      const response = await axios.post('http://localhost:5001/api/chat/campusconnect', {
        messages: [...messages, userMessage],
        model: selectedModel,
        temperature: temperature,
        maxTokens: maxTokens,
        customInstructions: customInstructions
      });

      if (response.data.success) {
        // Add AI response to chat
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.message 
        }]);

        // Update conversation title if it's a new conversation
        if (conversations.find(c => c.id === activeConversation).messages.length === 0) {
          // Extract first 30 chars of first user message as conversation title
          const newTitle = userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : '');
          updateConversationTitle(activeConversation, newTitle);
        }

        // Save messages to the current conversation
        updateConversationMessages(activeConversation, [...messages, userMessage, { 
          role: 'assistant', 
          content: response.data.message 
        }]);
      } else {
        throw new Error(response.data.message || "Error from AI service");
      }
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
      } else if (error.response?.status === 429) {
        assistantErrorMessage = 
          "Error: The AI service is experiencing high demand. Please try again in a moment.\n\n" +
          "This is a rate limit error from the Mistral API.";
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
    
    // Also clear the messages in the active conversation
    updateConversationMessages(activeConversation, [{
      role: 'assistant',
      content: 'Hello! I am CampusConnect, your educational assistant. How can I help you today?'
    }]);
  };

  const updateConversationTitle = (id, title) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title } : conv
      )
    );
  };

  const updateConversationMessages = (id, messages) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, messages } : conv
      )
    );
  };

  const loadConversation = (id) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setActiveConversation(id);
      // If the conversation has messages, load them
      if (conversation.messages.length > 0) {
        setMessages(conversation.messages);
      } else {
        // Otherwise, start with a welcome message
        setMessages([{
          role: 'assistant',
          content: 'Hello! I am CampusConnect, your educational assistant. How can I help you today?'
        }]);
      }
    }
  };

  const saveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: `Model: ${selectedModel}, Temperature: ${temperature}`,
      status: 'success',
      duration: 2000,
    });
    onClose();
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
          
          <Button
            variant="outline"
            leftIcon={<FiSettings />}
            justifyContent="flex-start"
            mb={2}
            onClick={onOpen}
            size="sm"
          >
            AI Settings
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
              onClick={() => loadConversation(conv.id)}
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
          
          <Flex>
            <IconButton
              icon={<FiSettings />}
              variant="ghost"
              aria-label="AI Settings"
              onClick={onOpen}
              mr={2}
              display={{ base: 'flex', md: 'none' }}
            />
            <IconButton
              icon={<FiTrash2 />}
              variant="ghost"
              aria-label="Clear chat"
              onClick={clearChat}
            />
          </Flex>
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

      {/* Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>AI Assistant Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>AI Model</FormLabel>
                <Select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Temperature: {temperature.toFixed(1)}</FormLabel>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={setTemperature}
                  onMouseEnter={() => setShowTemperatureTooltip(true)}
                  onMouseLeave={() => setShowTemperatureTooltip(false)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <Tooltip
                    hasArrow
                    bg='teal.500'
                    color='white'
                    placement='top'
                    isOpen={showTemperatureTooltip}
                    label={`${temperature.toFixed(1)}: ${temperature < 0.4 ? 'More deterministic' : temperature > 0.7 ? 'More creative' : 'Balanced'}`}
                  >
                    <SliderThumb />
                  </Tooltip>
                </Slider>
                <Text fontSize="xs" color="gray.500">
                  Lower values (0.0-0.3): More deterministic, factual responses
                  <br />
                  Higher values (0.7-1.0): More creative, varied responses
                </Text>
              </FormControl>
              
              <FormControl>
                <FormLabel>Max Response Length</FormLabel>
                <Select
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                >
                  <option value={256}>Short (256 tokens)</option>
                  <option value={512}>Medium (512 tokens)</option>
                  <option value={1024}>Standard (1024 tokens)</option>
                  <option value={2048}>Long (2048 tokens)</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Custom Instructions (Optional)</FormLabel>
                <Textarea
                  placeholder="Add custom instructions for the AI..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  size="sm"
                  rows={3}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  These will be added to the system prompt to tailor the AI's behavior
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" leftIcon={<FiSave />} onClick={saveSettings}>
              Save Settings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CampusConnectChat; 