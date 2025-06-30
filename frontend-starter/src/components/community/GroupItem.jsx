import React from 'react';
import { 
  Flex, 
  Box, 
  Text, 
  Avatar, 
  Icon, 
  IconButton, 
  HStack,
  useColorModeValue 
} from '@chakra-ui/react';
import { 
  FiLock, 
  FiLogOut, 
  FiUserPlus 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const GroupItem = ({ 
  group, 
  isActive, 
  isMember, 
  currentUser, 
  switchToGroup, 
  handleJoinGroup, 
  handleLeaveGroup, 
  activeUsers 
}) => {
  const isDM = group.isDM;
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // For DM groups, get the other user
  const otherUser = isDM ? (() => {
    const otherUserId = group.members.find(id => id !== currentUser.id);
    return activeUsers.find(u => u.id === otherUserId) || { 
      name: "User", 
      isOnline: false 
    };
  })() : null;
  
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <Flex 
        px={4}
        py={3}
        align="center"
        bg={isActive ? `${group.color}.50` : 'transparent'}
        borderLeftWidth={isActive ? "4px" : "0px"}
        borderColor={`${group.color}.500`}
        _hover={{ 
          bg: isActive 
            ? `${group.color}.50` 
            : useColorModeValue('gray.50', 'gray.700')
        }}
        cursor="pointer"
        onClick={() => isMember ? switchToGroup(group) : null}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
        position="relative"
      >
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: `var(--chakra-colors-${group.color}-500)`
            }}
          />
        )}
        
        {isDM ? (
          <Box position="relative">
            <Avatar 
              size="sm" 
              name={otherUser.name} 
              src={otherUser.avatar}
              mr={3}
            />
            <Box 
              position="absolute" 
              bottom="0" 
              right="3px" 
              w="8px" 
              h="8px" 
              borderRadius="full" 
              bg={otherUser.isOnline ? "green.400" : "gray.400"}
              borderWidth="1.5px"
              borderColor={useColorModeValue("white", "gray.800")}
            />
          </Box>
        ) : (
          <Avatar 
            size="sm" 
            name={group.name} 
            src={group.icon}
            bg={`${group.color}.400`}
            color="white"
            mr={3}
          />
        )}
        
        <Box flex="1" isTruncated>
          <HStack>
            <Text fontWeight={isActive ? "bold" : "medium"}>
              {isDM ? otherUser.name : group.name}
            </Text>
            {group.isPrivate && (
              <Icon as={FiLock} boxSize={3} color="gray.500" />
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500" isTruncated>
            {isDM 
              ? (otherUser.isOnline ? "Online" : otherUser.lastActive || "Offline")
              : group.description
            }
          </Text>
        </Box>
        
        {!isDM && (
          <Box>
            {isMember ? (
              <IconButton
                icon={<FiLogOut />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLeaveGroup(group);
                }}
                aria-label="Leave group"
                title="Leave group"
              />
            ) : (
              <IconButton
                icon={<FiUserPlus />}
                size="xs"
                variant="ghost"
                colorScheme="green"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinGroup(group);
                }}
                aria-label="Join group"
                title="Join group"
              />
            )}
          </Box>
        )}
      </Flex>
    </motion.div>
  );
};

export default GroupItem; 