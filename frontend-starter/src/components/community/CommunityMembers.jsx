import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Flex,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FiSearch, FiCircle, FiUser, FiUsers, FiStar, FiShield } from 'react-icons/fi';

const CommunityMembers = ({ 
  members, 
  activeUsers, 
  currentUser, 
  selectedUser,
  onSelectUser,
  showAllUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on search query
  const filteredMembers = searchQuery.trim() === '' 
    ? members 
    : members.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const filteredActiveUsers = searchQuery.trim() === ''
    ? activeUsers
    : activeUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Get current user ID
  const currentUserId = currentUser?._id;
  
  // Role badges with associated icons and colors
  const roleBadges = {
    admin: { icon: FiStar, color: 'red.500', label: 'Admin' },
    moderator: { icon: FiShield, color: 'purple.500', label: 'Moderator' },
    member: { icon: FiUser, color: 'gray.500', label: 'Member' }
  };
  
  return (
    <Box h="100%">
      {/* Search */}
      <Box p={3}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="full"
          />
        </InputGroup>
      </Box>
      
      <Divider />
      
      {/* Members List */}
      {!showAllUsers && (
        <>
          <Box px={3} py={2} bg="gray.50">
            <Flex align="center">
              <Icon as={FiUsers} fontSize="sm" color="gray.600" mr={2} />
              <Text fontWeight="medium" fontSize="sm" color="gray.700">
                Members ({members.length || 0})
              </Text>
            </Flex>
          </Box>
          
          <VStack spacing={0} align="stretch" maxH="35vh" overflowY="auto">
            {filteredMembers.length === 0 ? (
              <Box p={3} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  {searchQuery.trim() !== '' ? 'No matching members' : 'No members yet'}
                </Text>
              </Box>
            ) : (
              filteredMembers.map(member => {
                const isCurrentUser = member._id === currentUserId;
                const isSelected = selectedUser && selectedUser._id === member._id;
                const role = member.role || 'member';
                const roleBadge = roleBadges[role];
                
                return (
                  <Box 
                    key={member._id}
                    px={3}
                    py={2}
                    _hover={{ bg: 'gray.100' }}
                    cursor={isCurrentUser ? 'default' : 'pointer'}
                    onClick={() => !isCurrentUser && onSelectUser(member)}
                    bg={isSelected ? 'blue.50' : 'transparent'}
                  >
                    <HStack spacing={3}>
                      <Box position="relative">
                        <Avatar 
                          size="sm" 
                          name={member.name} 
                          src={member.profilePicture} 
                        />
                        {member.isOnline && (
                          <Box 
                            position="absolute" 
                            bottom="0" 
                            right="0"
                            bg="green.400" 
                            borderRadius="full" 
                            boxSize="10px" 
                            borderWidth="2px" 
                            borderColor="white" 
                          />
                        )}
                      </Box>
                      
                      <Box>
                        <HStack>
                          <Text fontSize="sm" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
                            {member.name}
                            {isCurrentUser && ' (You)'}
                          </Text>
                          {roleBadge && (
                            <Tooltip label={roleBadge.label}>
                              <Icon as={roleBadge.icon} color={roleBadge.color} fontSize="xs" />
                            </Tooltip>
                          )}
                        </HStack>
                        
                        <Text fontSize="xs" color="gray.500">
                          {member.isOnline ? 'Online' : 'Offline'}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                );
              })
            )}
          </VStack>
          
          <Divider />
        </>
      )}
      
      {/* Active Users / Contacts */}
      <Box px={3} py={2} bg="gray.50">
        <Flex align="center">
          <Box position="relative" mr={2}>
            <Icon as={FiUsers} fontSize="sm" color="gray.600" />
            <Box 
              position="absolute" 
              bottom="-1px" 
              right="-1px"
              bg="green.400" 
              borderRadius="full" 
              boxSize="6px" 
            />
          </Box>
          <Text fontWeight="medium" fontSize="sm" color="gray.700">
            Online Users ({filteredActiveUsers.filter(u => u.isOnline).length || 0})
          </Text>
        </Flex>
      </Box>
      
      <VStack spacing={0} align="stretch" maxH="35vh" overflowY="auto">
        {filteredActiveUsers.length === 0 ? (
          <Box p={3} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              {searchQuery.trim() !== '' ? 'No matching users' : 'No users online'}
            </Text>
          </Box>
        ) : (
          filteredActiveUsers
            // Sort online users first
            .sort((a, b) => {
              if (a.isOnline && !b.isOnline) return -1;
              if (!a.isOnline && b.isOnline) return 1;
              return a.name?.localeCompare(b.name);
            })
            .map(user => {
              const isCurrentUser = user._id === currentUserId;
              const isSelected = selectedUser && selectedUser._id === user._id;
              
              return (
                <Box 
                  key={user._id}
                  px={3}
                  py={2}
                  _hover={{ bg: 'gray.100' }}
                  cursor={isCurrentUser ? 'default' : 'pointer'}
                  onClick={() => !isCurrentUser && onSelectUser(user)}
                  bg={isSelected ? 'blue.50' : 'transparent'}
                >
                  <HStack spacing={3}>
                    <Box position="relative">
                      <Avatar 
                        size="sm" 
                        name={user.name} 
                        src={user.profilePicture} 
                      />
                      {user.isOnline && (
                        <Box 
                          position="absolute" 
                          bottom="0" 
                          right="0"
                          bg="green.400" 
                          borderRadius="full" 
                          boxSize="10px" 
                          borderWidth="2px" 
                          borderColor="white" 
                        />
                      )}
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
                        {user.name}
                        {isCurrentUser && ' (You)'}
                      </Text>
                      <Text fontSize="xs" color={user.isOnline ? 'green.500' : 'gray.500'}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              );
            })
        )}
      </VStack>
    </Box>
  );
};

export default CommunityMembers; 