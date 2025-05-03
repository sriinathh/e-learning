import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Spinner,
  useToast,
  IconButton,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";
import { FiUsers, FiPlus, FiLogOut, FiLogIn, FiInfo } from "react-icons/fi";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

const GroupsList = ({ onGroupSelect }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { authUser } = useAuthStore();
  const { 
    groups, 
    isLoading, 
    error, 
    fetchGroups, 
    createGroup, 
    getLocalGroups,
    joinGroup,
    leaveGroup,
    currentGroup
  } = useChatStore();

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Load groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        await fetchGroups();
      } catch (error) {
        console.error("Error loading groups:", error);
        // Fall back to local data if API fails
        useChatStore.setState({ groups: getLocalGroups(), isLoading: false });
      }
    };

    // For now, use local data
    useChatStore.setState({ groups: getLocalGroups(), isLoading: false });
    
    // In production, uncomment this:
    // loadGroups();
  }, [fetchGroups, getLocalGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setFormLoading(true);
    
    try {
      const result = await createGroup({ 
        name: newGroupName,
        description: newGroupDescription 
      });
      
      if (result.success) {
        toast({
          title: "Group created!",
          description: `"${newGroupName}" group has been created`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        setNewGroupName("");
        setNewGroupDescription("");
        onClose();
        
        // Select the newly created group
        if (onGroupSelect) onGroupSelect(result.group);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Failed to create group",
        description: error.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleJoinLeaveGroup = async (group) => {
    try {
      if (group.isMember) {
        const result = await leaveGroup(group._id);
        if (result.success) {
          toast({
            title: "Left group",
            description: `You have left "${group.name}"`,
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          
          // Refresh groups list
          fetchGroups();
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await joinGroup(group._id);
        if (result.success) {
          toast({
            title: "Joined group",
            description: `You have joined "${group.name}"`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          
          // Refresh groups list
          fetchGroups();
          
          // Select the group we just joined
          if (onGroupSelect) onGroupSelect(group);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: error.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box h="100%" display="flex" justifyContent="center" alignItems="center">
        <Spinner color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box h="100%" display="flex" justifyContent="center" alignItems="center" p={4}>
        <Text color="red.500" textAlign="center">{error}</Text>
      </Box>
    );
  }

  return (
    <Box h="100%" w="100%" borderLeft="1px solid" borderColor="gray.200" bg="white">
      <Flex 
        p={5} 
        borderBottom="1px solid" 
        borderColor="gray.200" 
        align="center" 
        justify="space-between"
        position="sticky" 
        top={0} 
        zIndex={1} 
        boxShadow="sm"
        bg="white"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="20px" color="blue.500" mr={2} />
          <Text fontSize="lg" fontWeight="bold" color="gray.700">Groups</Text>
          <Badge ml={2} colorScheme="blue" borderRadius="full" px={2} py={0.5} fontSize="xs">
            {groups.length}
          </Badge>
        </Flex>
        <IconButton
          aria-label="Create new group"
          icon={<FiPlus />}
          size="sm"
          colorScheme="blue"
          onClick={onOpen}
          borderRadius="full"
        />
      </Flex>

      <Box flex="1" overflowY="auto" p={4}>
        <VStack align="stretch" spacing={3}>
          {groups.map((group) => {
            const isActive = currentGroup && currentGroup._id === group._id;
            const isMember = group.isMember; // In a real app, this would come from the API
            
            return (
              <Box key={group._id}> 
                <Flex 
                  p={3} 
                  bg={isActive ? "blue.50" : "white"} 
                  borderRadius="lg" 
                  boxShadow="sm" 
                  align="center" 
                  borderWidth="1px" 
                  borderColor={isActive ? "blue.200" : "gray.100"}
                  cursor="pointer"
                  onClick={() => onGroupSelect && onGroupSelect(group)}
                  role="group"
                  transition="all 0.2s"
                  _hover={{ bg: "gray.50" }}
                >
                  <Avatar 
                    size="sm" 
                    name={group.name} 
                    src={group.avatar} 
                    bg="blue.500" 
                    color="white" 
                    mr={3} 
                  />
                  <Box flex="1">
                    <Text 
                      fontSize="sm" 
                      fontWeight="medium" 
                      color="gray.700" 
                      noOfLines={1}
                    >
                      {group.name}
                    </Text>
                    {group.description && (
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {group.description}
                      </Text>
                    )}
                  </Box>
                  
                  <Tooltip label={isMember ? "Leave group" : "Join group"} placement="top">
                    <IconButton
                      icon={isMember ? <FiLogOut /> : <FiLogIn />}
                      aria-label={isMember ? "Leave group" : "Join group"}
                      size="xs"
                      colorScheme={isMember ? "red" : "green"}
                      variant="ghost"
                      ml={2}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinLeaveGroup(group);
                      }}
                      _groupHover={{ opacity: 1 }}
                      opacity={0.7}
                    />
                  </Tooltip>
                </Flex>
              </Box>
            );
          })}
          
          {groups.length === 0 && (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              p={6} 
              bg="gray.50" 
              borderRadius="md"
              textAlign="center"
              gap={4}
            >
              <Icon as={FiInfo} fontSize="3xl" color="gray.400" />
              <Text color="gray.600">No groups available yet</Text>
              <Button
                leftIcon={<FiPlus />}
                size="sm"
                colorScheme="blue"
                onClick={onOpen}
              >
                Create a group
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>

      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleCreateGroup}>
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input 
                  placeholder="Enter group name" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="What is this group about?"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  rows={4}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="blue" 
                mr={3} 
                type="submit"
                isLoading={formLoading}
              >
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GroupsList; 