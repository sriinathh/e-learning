import React, { useState, useRef } from 'react';
import { 
  Flex, 
  Box, 
  HStack, 
  Input, 
  InputGroup, 
  InputRightElement, 
  IconButton,
  useColorModeValue,
  Text,
  Kbd,
  Icon,
  Tooltip,
  useToast,
  Image
} from '@chakra-ui/react';
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiX, 
  FiMessageCircle,
  FiVideo,
  FiFile 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const MessageInputBar = ({ 
  messageInput, 
  setMessageInput, 
  handleSendMessage, 
  fileInputRef, 
  handleFileSelect, 
  attachments, 
  removeAttachment,
  currentGroup,
  currentUser,
  renderAttachmentPreview
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  
  const typingIndicatorTimeout = useRef(null);
  
  const simulateTypingIndicator = () => {
    setIsTyping(true);
    
    if (typingIndicatorTimeout.current) {
      clearTimeout(typingIndicatorTimeout.current);
    }
    
    typingIndicatorTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      {/* Typing indicator */}
      {isTyping && (
        <Flex px={4} py={2} align="center">
          <Text fontSize="xs" color="gray.500">
            Someone is typing...
          </Text>
          <Box ml={2}>
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Icon as={FiMessageCircle} color="blue.400" />
            </motion.div>
          </Box>
        </Flex>
      )}
      
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <Box 
          p={3} 
          bg={useColorModeValue("gray.50", "gray.700")}
          borderTopWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          overflowX="auto"
        >
          <Flex gap={3}>
            {attachments.map(attachment => (
              <Box 
                key={attachment.id}
                position="relative"
                h="80px"
                w="80px"
                borderRadius="md"
                overflow="hidden"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                {renderAttachmentPreview(attachment)}
                
                <IconButton
                  icon={<FiX />}
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  borderRadius="full"
                  colorScheme="red"
                  onClick={() => removeAttachment(attachment.id)}
                  aria-label="Remove attachment"
                />
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    
      <Flex 
        p={3} 
        bg={useColorModeValue("white", "gray.800")} 
        borderTopWidth={attachments.length === 0 ? "1px" : "0"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        position="relative"
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        />
      
        <Box 
          position="absolute" 
          bottom="100%" 
          left={0} 
          right={0} 
          px={4} 
          py={1}
          bg={useColorModeValue("blue.50", "blue.900")}
          borderTopWidth="1px"
          borderColor={useColorModeValue("blue.100", "blue.700")}
          display={messageInput.length > 100 ? "block" : "none"}
        >
          <HStack justify="space-between">
            <Text fontSize="xs" color={useColorModeValue("blue.600", "blue.200")}>
              {messageInput.length}/2000
            </Text>
            <HStack spacing={1}>
              <Kbd fontSize="xs">ESC</Kbd>
              <Text fontSize="xs" color="gray.500">to cancel</Text>
              <Kbd fontSize="xs">⌘</Kbd>
              <Kbd fontSize="xs">↵</Kbd>
              <Text fontSize="xs" color="gray.500">to send</Text>
            </HStack>
          </HStack>
        </Box>
      
        <InputGroup size="md">
          <Input
            placeholder={`Message ${currentGroup.isDM ? 'user' : currentGroup.name}...`}
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              if (Math.random() > 0.7) simulateTypingIndicator();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            pr="8rem"
            borderRadius="full"
            bg={useColorModeValue("gray.50", "gray.700")}
            _focus={{
              bg: useColorModeValue("white", "gray.600"),
              borderColor: "blue.400"
            }}
            fontSize="md"
          />
          <InputRightElement width="8rem">
            <HStack spacing={2} mr={2}>
              <Tooltip label="Attach files" openDelay={500}>
                <IconButton
                  icon={<FiPaperclip />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach files"
                  isDisabled={attachments.length >= 5}
                  borderRadius="full"
                />
              </Tooltip>
              
              <Tooltip label="Add emoji" openDelay={500}>
                <IconButton
                  icon={<FiSmile />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  aria-label="Add emoji"
                  borderRadius="full"
                  onClick={() => {
                    toast({
                      title: "Emoji picker",
                      description: "Emoji picker coming soon!",
                      status: "info",
                      duration: 2000,
                    });
                  }}
                />
              </Tooltip>
              
              <IconButton
                icon={<FiSend />}
                size="sm"
                colorScheme="blue"
                onClick={handleSendMessage}
                isDisabled={!messageInput.trim() && attachments.length === 0}
                aria-label="Send message"
                borderRadius="full"
                _hover={{
                  transform: "translateX(2px)"
                }}
                transition="all 0.2s"
              />
            </HStack>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </>
  );
};

export default MessageInputBar; 