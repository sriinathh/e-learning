import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Avatar, 
  Icon, 
  IconButton, 
  Image,
  HStack,
  useColorModeValue,
  Tooltip,
  Tag,
  useToast
} from '@chakra-ui/react';
import { 
  FiCheck, 
  FiDownload, 
  FiCopy, 
  FiVideo, 
  FiFile 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Message = ({ message, currentUser, isNew }) => {
  const isSelf = message.sender === currentUser.id;
  const toast = useToast();
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex
        justify={isSelf ? "flex-end" : "flex-start"}
        align="flex-start"
        maxW="100%"
        mb={3}
      >
        {!isSelf && (
          <Box position="relative">
            <Avatar 
              size="sm" 
              name={message.senderName} 
              src={message.avatar}
              mr={2}
              boxShadow="sm"
              border="2px solid"
              borderColor={useColorModeValue("white", "gray.800")}
            />
            <Tooltip label="Online" placement="top">
              <Box 
                position="absolute" 
                bottom="0" 
                right="2px" 
                w="8px" 
                h="8px" 
                borderRadius="full" 
                bg="green.400"
                borderWidth="1.5px"
                borderColor={useColorModeValue("white", "gray.800")}
              />
            </Tooltip>
          </Box>
        )}
        
        <Box maxWidth="70%">
          {!isSelf && (
            <Text fontSize="xs" fontWeight="bold" mb={1} ml={1} color={useColorModeValue("gray.600", "gray.400")}>
              {message.senderName}
            </Text>
          )}
          
          <Flex direction="column" align={isSelf ? "flex-end" : "flex-start"}>
            <Box
              px={4}
              py={2}
              bg={isSelf 
                ? useColorModeValue("blue.100", "blue.700") 
                : useColorModeValue("gray.100", "gray.700")
              }
              borderRadius={isSelf ? "2xl 2xl 0 2xl" : "2xl 2xl 2xl 0"}
              shadow="sm"
              borderWidth="1px"
              borderColor={isSelf 
                ? useColorModeValue("blue.200", "blue.600") 
                : useColorModeValue("gray.200", "gray.600")
              }
              _hover={{
                bg: isSelf 
                  ? useColorModeValue("blue.50", "blue.800") 
                  : useColorModeValue("gray.50", "gray.800")
              }}
              transition="background 0.2s"
            >
              {message.text && <Text>{message.text}</Text>}
              
              {message.attachments && message.attachments.length > 0 && (
                <VStack mt={message.text ? 2 : 0} spacing={2} align="stretch">
                  {message.attachments.map(attachment => (
                    <Box
                      key={attachment.id}
                      borderWidth="1px"
                      borderRadius="md"
                      overflow="hidden"
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: "blue.400",
                        shadow: "md"
                      }}
                    >
                      {attachment.type.startsWith('image/') ? (
                        <Box 
                          position="relative" 
                          onClick={() => window.open(attachment.url, '_blank')}
                          cursor="pointer"
                          maxH="200px"
                          overflow="hidden"
                        >
                          <Image 
                            src={attachment.url} 
                            alt={attachment.name} 
                            objectFit="cover"
                            w="100%"
                            transition="transform 0.3s"
                            _hover={{ transform: "scale(1.02)" }}
                          />
                          <Box
                            position="absolute"
                            bottom={0}
                            left={0}
                            right={0}
                            py={1}
                            px={2}
                            bg="rgba(0,0,0,0.5)"
                            color="white"
                            fontSize="xs"
                            opacity={0}
                            transition="opacity 0.2s"
                            _groupHover={{ opacity: 1 }}
                          >
                            <Text isTruncated>{attachment.name}</Text>
                          </Box>
                        </Box>
                      ) : (
                        <Flex 
                          p={2} 
                          align="center"
                          bg={useColorModeValue("gray.50", "gray.700")}
                        >
                          <Box 
                            mr={3}
                            p={2}
                            borderRadius="md"
                            bg={useColorModeValue("blue.50", "blue.900")}
                          >
                            <Icon 
                              as={attachment.type.startsWith('video/') ? FiVideo : FiFile} 
                              boxSize={5} 
                              color="blue.500" 
                            />
                          </Box>
                          
                          <Box flex={1} overflow="hidden">
                            <Text fontSize="sm" fontWeight="medium" isTruncated>
                              {attachment.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatFileSize(attachment.size)}
                            </Text>
                          </Box>
                          
                          <HStack>
                            <Tooltip label="Download">
                              <IconButton
                                icon={<FiDownload />}
                                size="sm"
                                variant="ghost"
                                as="a"
                                href={attachment.url}
                                download={attachment.name}
                                aria-label="Download file"
                                colorScheme="blue"
                              />
                            </Tooltip>
                            
                            <Tooltip label="Copy link">
                              <IconButton
                                icon={<FiCopy />}
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(attachment.url);
                                  toast({
                                    title: "Link copied",
                                    status: "success",
                                    duration: 2000,
                                  });
                                }}
                                aria-label="Copy link"
                                colorScheme="blue"
                              />
                            </Tooltip>
                          </HStack>
                        </Flex>
                      )}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
            
            <Flex fontSize="xs" color="gray.500" mt={1} mx={1} align="center">
              <Text>{message.timestamp}</Text>
              {isSelf && (
                <Icon 
                  as={FiCheck} 
                  ml={1} 
                  color="blue.500" 
                  boxSize={3} 
                />
              )}
            </Flex>
          </Flex>
        </Box>
        
        {isSelf && (
          <Avatar 
            size="sm" 
            name={currentUser.name} 
            src={currentUser.avatar}
            ml={2}
            boxShadow="sm"
            border="2px solid"
            borderColor={useColorModeValue("white", "gray.800")}
          />
        )}
      </Flex>
    </motion.div>
  );
};

// Component for date separators between messages
export const DateSeparator = ({ date }) => {
  return (
    <Flex justify="center" my={2}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tag 
          size="sm" 
          colorScheme="blue" 
          borderRadius="full"
          boxShadow="sm"
          px={3}
          py={1}
        >
          {date}
        </Tag>
      </motion.div>
    </Flex>
  );
};

export default Message; 