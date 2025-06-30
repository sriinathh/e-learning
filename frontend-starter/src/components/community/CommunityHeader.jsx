import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  IconButton,
  Text,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FiSearch, FiBell, FiSettings, FiMessageCircle, FiPlus, FiUsers } from 'react-icons/fi';

const CommunityHeader = ({ selectedGroup, showMembersList, toggleMembersList }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex 
      px={8} 
      py={4} 
      bg="purple.600" 
      color="white"
      borderBottomWidth="1px" 
      borderColor="purple.700"
      align="center"
      justify="space-between"
      boxShadow="md"
      height="64px"
    >
      <HStack spacing={4}>
        <Icon as={FiMessageCircle} fontSize="2xl" color="white" />
        <Heading size="md">
          Campus Community
        </Heading>
      </HStack>
      
      <HStack spacing={5}>
        <InputGroup maxW="300px" size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search..." 
            bg="whiteAlpha.300" 
            border="none" 
            _placeholder={{ color: "whiteAlpha.700" }}
            _hover={{ bg: "whiteAlpha.400" }}
            _focus={{ bg: "whiteAlpha.500", borderColor: "transparent" }}
          />
        </InputGroup>
        
        {selectedGroup && (
          <Tooltip label={showMembersList ? "Hide Members" : "Show Members"}>
            <IconButton
              icon={<FiUsers />}
              colorScheme="whiteAlpha"
              variant="ghost" 
              onClick={toggleMembersList}
              aria-label="Toggle members list"
              fontSize="lg"
              _hover={{ bg: "whiteAlpha.300" }}
              isActive={showMembersList}
            />
          </Tooltip>
        )}
        
        <Tooltip label="Create New Group">
          <IconButton
            icon={<FiPlus />}
            colorScheme="whiteAlpha"
            variant="ghost"
            aria-label="Create new group"
            fontSize="lg"
            _hover={{ bg: "whiteAlpha.300" }}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default CommunityHeader; 