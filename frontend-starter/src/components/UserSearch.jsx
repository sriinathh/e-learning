import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  HStack,
  Avatar,
  Text,
  Spinner,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { FiSearch, FiUserPlus, FiUser } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import { getMockUsers } from '../utils/socketService';

const UserSearch = ({ onSelectUser, onAddToChat }) => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle search submit
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // In a real app, this would be an API call to search users
    // For now, we'll use our mock data and filter by username
    setTimeout(() => {
      const allUsers = getMockUsers(currentUser?.id);
      const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        user.id !== currentUser?.id
      );
      
      setSearchResults(filteredUsers);
      setLoading(false);
      
      if (filteredUsers.length === 0) {
        toast({
          title: 'No users found',
          description: `No users matching "${searchTerm}" were found.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    }, 500);
  };

  // Handle selecting a user
  const handleSelectUser = (user) => {
    if (onSelectUser) {
      onSelectUser(user);
    }
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  // Handle adding a user to a group chat
  const handleAddToChat = (user) => {
    if (onAddToChat) {
      onAddToChat(user);
      toast({
        title: 'User added',
        description: `${user.name} has been added to the chat.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      autoFocus={false}
    >
      <PopoverTrigger>
        <Button
          leftIcon={<FiSearch />}
          variant="outline"
          onClick={onOpen}
          size="sm"
          borderRadius="full"
        >
          Find users
        </Button>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody p={4}>
          <VStack spacing={3} align="stretch">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                ref={inputRef}
                placeholder="Search by username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                ml={2}
                onClick={handleSearch}
                isLoading={loading}
                colorScheme="blue"
              >
                Search
              </Button>
            </InputGroup>
            
            {loading ? (
              <Box textAlign="center" py={4}>
                <Spinner size="sm" mr={2} />
                <Text display="inline">Searching...</Text>
              </Box>
            ) : searchResults.length > 0 ? (
              <VStack spacing={2} align="stretch" maxH="250px" overflowY="auto">
                {searchResults.map(user => (
                  <HStack
                    key={user.id}
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                    _hover={{ bg: 'gray.50' }}
                    justify="space-between"
                  >
                    <HStack spacing={3}>
                      <Avatar size="sm" name={user.name} src={user.avatar} />
                      <Box>
                        <Text fontWeight="medium">{user.name}</Text>
                        {user.email && (
                          <Text fontSize="xs" color="gray.500">
                            {user.email}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                    <HStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleSelectUser(user)}
                        title="Start chat"
                        aria-label="Start chat"
                      >
                        <FiUser />
                      </Button>
                      {onAddToChat && (
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                          onClick={() => handleAddToChat(user)}
                          title="Add to chat"
                          aria-label="Add to chat"
                        >
                          <FiUserPlus />
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            ) : searchTerm ? (
              <Text textAlign="center" color="gray.500" py={4}>
                No users found matching "{searchTerm}"
              </Text>
            ) : null}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserSearch; 