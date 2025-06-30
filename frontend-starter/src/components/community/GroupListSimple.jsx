import React from 'react';
import {
  Box,
  VStack,
  Flex,
  Text,
  Icon,
  Avatar,
  Badge,
  Button,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FiPlus, FiUsers, FiMessageCircle } from 'react-icons/fi';

const GroupItem = ({ 
  group, 
  isSelected, 
  onSelectGroup, 
  onJoinGroup, 
  onLeaveGroup,
  currentUser
}) => {
  const bgColor = useColorModeValue(
    isSelected ? 'purple.50' : 'white',
    isSelected ? 'purple.900' : 'gray.800'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const isMember = group.isMember;

  return (
    <Flex
      direction="column"
      w="100%"
      borderBottomWidth="1px"
      borderColor={borderColor}
      _hover={{ bg: hoverBg }}
      bg={bgColor}
      cursor="pointer"
      onClick={() => isMember ? onSelectGroup(group) : null}
      position="relative"
      px={4}
      py={3}
    >
      {isSelected && (
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="4px"
          bg="purple.500"
        />
      )}

      <Flex align="center">
        <Avatar
          size="sm"
          name={group.name}
          src={group.avatar}
          bg={`${group.color}.500`}
          mr={3}
        />

        <Box flex="1">
          <Flex align="center" justify="space-between">
            <Text fontWeight={isSelected ? "bold" : "medium"} isTruncated>
              {group.name}
            </Text>
            {group.unreadCount > 0 && (
              <Badge colorScheme="purple" borderRadius="full">
                {group.unreadCount}
              </Badge>
            )}
          </Flex>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {group.description}
          </Text>
        </Box>
      </Flex>

      {!isMember && (
        <Button
          size="sm"
          colorScheme="purple"
          variant="outline"
          mt={2}
          onClick={(e) => {
            e.stopPropagation();
            onJoinGroup(group._id);
          }}
        >
          Join Group
        </Button>
      )}
    </Flex>
  );
};

const GroupListSimple = ({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  onJoinGroup, 
  onLeaveGroup, 
  currentUser,
  onGroupModalOpen 
}) => {
  // Separate groups into pinned and regular
  const pinnedGroups = groups.filter(g => g.isPinned);
  const regularGroups = groups.filter(g => !g.isPinned);
  const myGroups = regularGroups.filter(g => g.isMember);
  const discoverGroups = regularGroups.filter(g => !g.isMember);

  return (
    <Box
      w="280px"
      h="100%"
      overflowY="auto"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }
      }}
    >
      {/* Create Group Button */}
      <Flex 
        p={4} 
        borderBottomWidth="1px" 
        borderColor="gray.200"
        justify="center"
      >
        <Button
          leftIcon={<FiPlus />}
          colorScheme="purple"
          variant="solid"
          size="sm"
          width="100%"
          onClick={onGroupModalOpen}
        >
          Create New Group
        </Button>
      </Flex>

      {/* Pinned Groups */}
      {pinnedGroups.length > 0 && (
        <>
          <Flex align="center" px={4} py={2} bg="gray.50">
            <Icon as={FiMessageCircle} color="purple.500" mr={2} />
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Pinned
            </Text>
          </Flex>
          <VStack spacing={0} align="stretch">
            {pinnedGroups.map(group => (
              <GroupItem
                key={group._id}
                group={group}
                isSelected={selectedGroup && selectedGroup._id === group._id}
                onSelectGroup={onSelectGroup}
                onJoinGroup={onJoinGroup}
                onLeaveGroup={onLeaveGroup}
                currentUser={currentUser}
              />
            ))}
          </VStack>
        </>
      )}

      {/* My Groups */}
      <Flex align="center" px={4} py={2} bg="gray.50">
        <Icon as={FiUsers} color="purple.500" mr={2} />
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          My Groups
        </Text>
      </Flex>
      <VStack spacing={0} align="stretch">
        {myGroups.map(group => (
          <GroupItem
            key={group._id}
            group={group}
            isSelected={selectedGroup && selectedGroup._id === group._id}
            onSelectGroup={onSelectGroup}
            onJoinGroup={onJoinGroup}
            onLeaveGroup={onLeaveGroup}
            currentUser={currentUser}
          />
        ))}
      </VStack>

      {/* Discover Groups */}
      {discoverGroups.length > 0 && (
        <>
          <Flex align="center" px={4} py={2} bg="gray.50">
            <Icon as={FiMessageCircle} color="purple.500" mr={2} />
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Discover
            </Text>
          </Flex>
          <VStack spacing={0} align="stretch">
            {discoverGroups.map(group => (
              <GroupItem
                key={group._id}
                group={group}
                isSelected={selectedGroup && selectedGroup._id === group._id}
                onSelectGroup={onSelectGroup}
                onJoinGroup={onJoinGroup}
                onLeaveGroup={onLeaveGroup}
                currentUser={currentUser}
              />
            ))}
          </VStack>
        </>
      )}
    </Box>
  );
};

export default GroupListSimple; 