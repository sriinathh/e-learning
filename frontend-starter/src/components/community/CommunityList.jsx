import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Flex,
  Avatar,
  Divider,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FiLock, FiUsers, FiUserPlus, FiUserMinus, FiTag } from 'react-icons/fi';

const CommunityList = ({ 
  communities, 
  currentUser, 
  selectedCommunity, 
  onSelectCommunity, 
  onJoinCommunity, 
  onLeaveCommunity 
}) => {
  // Helper to generate avatar color
  const getAvatarColor = (communityName) => {
    const colors = [
      'red.500', 'orange.500', 'yellow.500', 'green.500', 
      'teal.500', 'blue.500', 'cyan.500', 'purple.500', 
      'pink.500'
    ];
    const index = communityName.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  // Helper to generate initials from community name
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(' ');
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0].slice(0, 2).toUpperCase();
  };
  
  // Get current user ID
  const currentUserId = currentUser?._id;

  return (
    <VStack align="stretch" spacing={0} pt={1}>
      {communities.length === 0 ? (
        <Box p={4} textAlign="center">
          <Text color="gray.500">No communities found</Text>
          <Text fontSize="sm" mt={2}>Create a new community to get started</Text>
        </Box>
      ) : (
        communities.map(community => {
          // Check if user is a member
          const isMember = community.members?.some(
            member => member.user === currentUserId
          ) || false;
          
          // Check if currently selected
          const isSelected = selectedCommunity?._id === community._id;
          
          return (
            <Box 
              key={community._id}
              px={3}
              py={2}
              borderLeftWidth={isSelected ? "4px" : "0px"}
              borderColor="blue.500"
              bg={isSelected ? "blue.50" : "transparent"}
              _hover={{ bg: isSelected ? "blue.50" : "gray.100" }}
              cursor="pointer"
              transition="all 0.2s"
              onClick={() => onSelectCommunity(community)}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={getInitials(community.name)} 
                    src={community.avatar} 
                    bg={getAvatarColor(community.name)}
                  />
                  
                  <Box>
                    <HStack spacing={1}>
                      <Text fontWeight={isSelected ? "bold" : "medium"}>
                        {community.name}
                      </Text>
                      {!community.isPublic && (
                        <Tooltip label="Private community">
                          <span>
                            <Icon as={FiLock} fontSize="xs" color="gray.500" />
                          </span>
                        </Tooltip>
                      )}
                    </HStack>
                    
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      {community.description || "No description"}
                    </Text>
                  </Box>
                </HStack>
                
                {community.tags && community.tags.length > 0 && (
                  <HStack spacing={1} mt={1} mb={1}>
                    <Icon as={FiTag} fontSize="xs" color="gray.500" />
                    <Text fontSize="xs" color="gray.500">
                      {community.tags.slice(0, 2).join(', ')}
                      {community.tags.length > 2 && '...'}
                    </Text>
                  </HStack>
                )}
                
                {!isMember ? (
                  <Tooltip label="Join community">
                    <Button
                      size="xs"
                      leftIcon={<FiUserPlus />}
                      colorScheme="green"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinCommunity(community._id);
                      }}
                    >
                      Join
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip label="Leave community">
                    <Button
                      size="xs"
                      leftIcon={<FiUserMinus />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeaveCommunity(community._id);
                      }}
                    >
                      Leave
                    </Button>
                  </Tooltip>
                )}
              </Flex>
              
              <Flex mt={1} justify="space-between" align="center">
                <HStack spacing={2}>
                  <Tooltip label="Total members">
                    <Flex align="center">
                      <Icon as={FiUsers} fontSize="xs" color="gray.500" mr={1} />
                      <Text fontSize="xs" color="gray.500">
                        {community.members?.length || 0}
                      </Text>
                    </Flex>
                  </Tooltip>
                  
                  {community.activeMembers > 0 && (
                    <Badge size="sm" colorScheme="green">
                      {community.activeMembers} online
                    </Badge>
                  )}
                </HStack>
              </Flex>
              
              <Divider mt={2} />
            </Box>
          );
        })
      )}
    </VStack>
  );
};

export default CommunityList; 