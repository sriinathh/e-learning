import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";
import { FiUsers, FiCircle } from "react-icons/fi";
import useAuthStore from "../store/authStore";

const UsersList = ({ users }) => {
  const { authUser } = useAuthStore();

  return (
    <Box h="100%" w="100%" borderLeft="1px solid" borderColor="gray.200" bg="white">
      <Flex p={5} borderBottom="1px solid" borderColor="gray.200" align="center" position="sticky" top={0} zIndex={1} boxShadow="sm">
        <Icon as={FiUsers} fontSize="20px" color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">Members</Text>
        <Badge ml={2} colorScheme="blue" borderRadius="full" px={2} py={0.5} fontSize="xs">{users.length}</Badge>
      </Flex>

      <Box flex="1" overflowY="auto" p={4}>
        <VStack align="stretch" spacing={3}>
          {users.map((user) => {
            // Check if this user is the current logged-in user
            const isCurrentUser = authUser && (user._id === authUser._id || 
                                           user.username === authUser.username);
            const displayName = isCurrentUser ? "You" : user.username;
            
            return (
              <Box key={user._id}> 
                <Tooltip label={user.isOnline ? `${displayName} is online` : `${displayName} is offline`} placement="left">
                  <Flex 
                    p={3} 
                    bg={isCurrentUser ? "blue.50" : "white"} 
                    borderRadius="lg" 
                    shadow="sm" 
                    align="center" 
                    borderWidth="1px" 
                    borderColor={isCurrentUser ? "blue.100" : "gray.100"}
                  >
                    <Avatar 
                      size="sm" 
                      name={user.username} 
                      src={isCurrentUser && authUser.profilePic ? authUser.profilePic : undefined}
                      bg={isCurrentUser ? "blue.500" : "gray.500"} 
                      color="white" 
                      mr={3} 
                    />
                    <Box flex="1">
                      <Text 
                        fontSize="sm" 
                        fontWeight={isCurrentUser ? "bold" : "medium"} 
                        color="gray.700" 
                        noOfLines={1}
                      >
                        {displayName}
                      </Text>
                    </Box>
                    <Flex 
                      align="center" 
                      bg={user.isOnline ? "green.50" : "gray.50"} 
                      px={2} 
                      py={1} 
                      borderRadius="full"
                    >
                      <Icon 
                        as={FiCircle} 
                        color={user.isOnline ? "green.400" : "gray.400"} 
                        fontSize="8px" 
                        mr={1} 
                      />
                      <Text 
                        fontSize="xs" 
                        color={user.isOnline ? "green.600" : "gray.600"} 
                        fontWeight="medium"
                      >
                        {user.isOnline ? "online" : "offline"}
                      </Text>
                    </Flex>
                  </Flex>
                </Tooltip>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};

export default UsersList;
