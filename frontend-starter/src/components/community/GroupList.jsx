import React from 'react';
import {
  Box,
  VStack,
  Flex,
  Text,
  Icon,
  Avatar,
  HStack,
  IconButton,
  useColorModeValue,
  Tooltip,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiMessageCircle, 
  FiUserPlus 
} from 'react-icons/fi';
import GroupItem from './GroupItem';
import { motion } from 'framer-motion';

const GroupList = ({ 
  activeTab, 
  setActiveTab, 
  groups, 
  currentGroup, 
  currentUser, 
  activeUsers, 
  switchToGroup, 
  handleJoinGroup, 
  handleLeaveGroup,
  startDirectMessage
}) => {
  return (
    <Box
      width={{ base: "100%", md: "320px" }}
      height="100%"
      borderRight="1px"
      borderColor="gray.200"
      bg="white"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 0, 0, 0.2)', borderRadius: '3px' }
      }}
    >
      <Tabs isFitted variant="enclosed" onChange={setActiveTab} index={activeTab}>
        <TabList>
          <Tab 
            fontSize="lg"
            py={3}
            _selected={{ 
              color: "blue.500", 
              fontWeight: "bold",
              borderColor: "blue.500",
              borderBottomColor: "transparent"
            }}
          >
            Groups
          </Tab>
          <Tab 
            fontSize="lg"
            py={3}
            _selected={{ 
              color: "purple.500", 
              fontWeight: "bold",
              borderColor: "purple.500",
              borderBottomColor: "transparent"
            }}
          >
            Users
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0}>
            {/* Show direct messages first */}
            {groups.some(g => g.isDM) && (
              <>
                <Flex 
                  px={4} 
                  py={2} 
                  align="center" 
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderBottomWidth="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <Icon as={FiMessageCircle} mr={2} color="blue.500" />
                  <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
                    Direct Messages
                  </Text>
                </Flex>
                
                <VStack spacing={0} align="stretch" mb={2}>
                  {groups.filter(g => g.isDM).map(group => (
                    <GroupItem 
                      key={group.id}
                      group={group}
                      isActive={currentGroup?.id === group.id}
                      isMember={group.members.includes(currentUser.id)}
                      currentUser={currentUser}
                      switchToGroup={switchToGroup}
                      handleJoinGroup={handleJoinGroup}
                      handleLeaveGroup={handleLeaveGroup}
                      activeUsers={activeUsers}
                    />
                  ))}
                </VStack>
              </>
            )}
            
            {/* Group chats */}
            <Flex 
              px={4} 
              py={2} 
              align="center" 
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderBottomWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Icon as={FiUsers} mr={2} color="blue.500" />
              <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
                Group Channels
              </Text>
            </Flex>
            
            <VStack spacing={0} align="stretch">
              {groups.filter(g => !g.isDM).map(group => (
                <GroupItem 
                  key={group.id}
                  group={group}
                  isActive={currentGroup?.id === group.id}
                  isMember={group.members.includes(currentUser.id)}
                  currentUser={currentUser}
                  switchToGroup={switchToGroup}
                  handleJoinGroup={handleJoinGroup}
                  handleLeaveGroup={handleLeaveGroup}
                  activeUsers={activeUsers}
                />
              ))}
            </VStack>
          </TabPanel>
          
          <TabPanel p={0}>
            <VStack spacing={0} align="stretch">
              {activeUsers.map(user => (
                <motion.div
                  key={user.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex 
                    px={4}
                    py={3}
                    align="center"
                    _hover={{ 
                      bg: useColorModeValue('gray.50', 'gray.700'),
                      boxShadow: 'sm'
                    }}
                    transition="all 0.2s"
                    borderBottomWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <Box position="relative">
                      <Avatar 
                        size="sm" 
                        name={user.name} 
                        src={user.avatar}
                        mr={3}
                      />
                      <Box 
                        position="absolute" 
                        bottom="0" 
                        right="3px" 
                        w="10px" 
                        h="10px" 
                        borderRadius="full" 
                        bg={user.isOnline ? "green.400" : "gray.400"}
                        borderWidth="1.5px"
                        borderColor={useColorModeValue("white", "gray.800")}
                      />
                    </Box>
                    
                    <Box flex="1">
                      <Text fontWeight={user.id === currentUser.id ? "bold" : "medium"}>
                        {user.name} {user.id === currentUser.id && "(You)"}
                      </Text>
                      {user.email && (
                        <Text fontSize="xs" color="gray.500">
                          {user.email}
                        </Text>
                      )}
                    </Box>
                    
                    <HStack>
                      <Text fontSize="xs" color="gray.500">
                        {user.isOnline ? "Online" : user.lastActive || "Offline"}
                      </Text>
                      
                      {user.id !== currentUser.id && (
                        <Tooltip label="Send message">
                          <IconButton
                            icon={<FiMessageCircle />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => startDirectMessage(user.id)}
                            aria-label="Send message"
                          />
                        </Tooltip>
                      )}
                    </HStack>
                  </Flex>
                </motion.div>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GroupList; 