import React from 'react';
import {
  Box,
  VStack,
  Flex,
  Text,
  Avatar,
  Divider,
  Icon,
  Badge,
  useColorModeValue,
  Heading,
  Button,
  AvatarBadge
} from '@chakra-ui/react';
import { FiUsers, FiUserPlus, FiStar, FiSettings, FiInfo } from 'react-icons/fi';

const MemberCard = ({ member, isAdmin, isCreator }) => {
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Flex
      py={3}
      px={5}
      align="center"
      _hover={{ bg: bgHover }}
      borderRadius="md"
      cursor="pointer"
      my={1}
    >
      <Avatar 
        size="md" 
        name={member.name} 
        src={member.avatar}
        mr={3}
      >
        {member.isOnline && (
          <AvatarBadge boxSize="1.25em" bg="green.500" />
        )}
      </Avatar>
      
      <Box flex={1} minW={0}>
        <Flex align="center">
          <Text fontWeight="medium" fontSize="md" noOfLines={1} mr={1}>
            {member.name}
          </Text>
          
          {isCreator && (
            <Icon as={FiStar} color="yellow.500" boxSize={4} mr={1} />
          )}
          
          {isAdmin && !isCreator && (
            <Badge colorScheme="purple" fontSize="xs" mr={1}>
              Admin
            </Badge>
          )}
        </Flex>
        
        <Text fontSize="sm" color={member.isOnline ? "green.500" : "gray.500"}>
          {member.isOnline ? 'Online' : 'Offline'}
        </Text>
      </Box>
    </Flex>
  );
};

const MembersList = ({ group, currentUser, allUsers }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Sort members: online first, then admins, then regular members
  const sortedMembers = group?.members?.sort((a, b) => {
    if (a.isOnline !== b.isOnline) {
      return a.isOnline ? -1 : 1;
    }
    if ((a.isAdmin || a.isCreator) !== (b.isAdmin || b.isCreator)) {
      return (a.isAdmin || a.isCreator) ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  }) || [];
  
  const onlineCount = sortedMembers.filter(m => m.isOnline).length;
  
  // Calculate online users who are not in this group
  const groupMemberIds = new Set(sortedMembers.map(m => m._id));
  const otherOnlineUsers = allUsers?.filter(u => 
    u.isOnline && !groupMemberIds.has(u._id)
  ) || [];
  
  return (
    <Box
      w="350px"
      borderLeft="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      h="100%"
      overflowY="auto"
      boxShadow="-2px 0 5px rgba(0,0,0,0.05)"
    >
      {group ? (
        <VStack align="stretch" spacing={0}>
          <Box p={5} borderBottom="1px solid" borderColor={borderColor} bg="purple.50">
            <Heading size="md" mb={2} color="purple.700">
              Group Members
            </Heading>
            <Text fontSize="md" color="gray.600">
              {sortedMembers.length} members · {onlineCount} online
            </Text>
          </Box>
          
          <Box p={5}>
            <Flex justify="space-between" mb={3}>
              <Button 
                leftIcon={<FiUserPlus />} 
                colorScheme="purple" 
                size="md" 
                variant="outline"
                isFullWidth
              >
                Invite People
              </Button>
            </Flex>
          </Box>
          
          <Divider />
          
          <Box p={4}>
            <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={3} textTransform="uppercase">
              Admins ({sortedMembers.filter(m => m.isAdmin || m.isCreator).length})
            </Text>
            
            <VStack align="stretch" spacing={1}>
              {sortedMembers
                .filter(m => m.isAdmin || m.isCreator)
                .map(member => (
                  <MemberCard
                    key={member._id}
                    member={member}
                    isAdmin={member.isAdmin}
                    isCreator={member.isCreator}
                  />
                ))
              }
            </VStack>
          </Box>
          
          <Divider />
          
          <Box p={3}>
            <Text fontWeight="bold" fontSize="xs" color="gray.500" mb={2}>
              MEMBERS ({sortedMembers.filter(m => !m.isAdmin && !m.isCreator).length})
            </Text>
            
            <VStack align="stretch" spacing={1}>
              {sortedMembers
                .filter(m => !m.isAdmin && !m.isCreator)
                .map(member => (
                  <MemberCard
                    key={member._id}
                    member={member}
                  />
                ))
              }
            </VStack>
          </Box>
          
          {otherOnlineUsers.length > 0 && (
            <>
              <Divider />
              
              <Box p={3}>
                <Text fontWeight="bold" fontSize="xs" color="gray.500" mb={2}>
                  OTHER ONLINE USERS ({otherOnlineUsers.length})
                </Text>
                
                <VStack align="stretch" spacing={1}>
                  {otherOnlineUsers.map(user => (
                    <MemberCard
                      key={user._id}
                      member={user}
                    />
                  ))}
                </VStack>
              </Box>
            </>
          )}
        </VStack>
      ) : (
        <VStack align="stretch" spacing={0}>
          <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
            <Heading size="sm" mb={1}>
              Online Users
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {allUsers?.filter(u => u.isOnline).length || 0} users online
            </Text>
          </Box>
          
          <Box p={3}>
            <VStack align="stretch" spacing={1}>
              {(allUsers || [])
                .filter(user => user.isOnline)
                .map(user => (
                  <MemberCard
                    key={user._id}
                    member={user}
                  />
                ))
              }
            </VStack>
          </Box>
          
          <Divider />
          
          <Box p={4}>
            <Flex direction="column" align="center" textAlign="center" py={4}>
              <Icon as={FiInfo} boxSize={10} color="blue.400" mb={4} />
              <Text fontSize="sm" color="gray.600" mb={3}>
                Select a group from the left sidebar to see its members and start chatting
              </Text>
              <Button
                leftIcon={<FiUsers />}
                colorScheme="blue"
                size="sm"
                variant="outline"
                mt={2}
              >
                Browse All Users
              </Button>
            </Flex>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default MembersList; 