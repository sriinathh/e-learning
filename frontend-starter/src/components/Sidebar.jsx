import {
    Box,
    VStack,
    Text,
    Button,
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
    useToast,
    Flex,
    Icon,
    Badge,
    Tooltip,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
  import { Link, useNavigate } from "react-router-dom";
  
  const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDescription, setNewGroupDescription] = useState("");
    const [groups, setGroups] = useState([
      {
        id: 1,
        name: "Development Team",
        description: "Main development team channel for daily updates",
        isJoined: true,
      },
      {
        id: 2,
        name: "Design Team",
        description: "Collaboration space for designers",
        isJoined: false,
      },
      {
        id: 3,
        name: "Marketing",
        description: "Marketing team discussions and campaigns",
        isJoined: true,
      },
    ]);
  
    const toast = useToast();
    const navigate = useNavigate();
    const isAdmin = true;
  
    const handleCreateGroup = () => {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        description: newGroupDescription,
        isJoined: true,
      };
      setGroups([...groups, newGroup]);
      toast({
        title: "Group created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewGroupName("");
      setNewGroupDescription("");
      onClose();
    };
  
    const handleToggleJoin = (id) => {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === id ? { ...group, isJoined: !group.isJoined } : group
        )
      );
    };
  
    const handleAccessGroup = (id) => {
      const group = groups.find((g) => g.id === id);
      if (!group.isJoined) {
        toast({
          title: "Access denied",
          description: "Join the group to access it.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      navigate(`/group/${id}`);
    };
  
    return (
      <Box h="100%" bg="white" borderRight="1px" borderColor="gray.200" width="300px" display="flex" flexDirection="column">
        <Flex p={4} borderBottom="1px solid" borderColor="gray.200" align="center" justify="space-between">
          <Flex align="center">
            <Icon as={FiUsers} fontSize="24px" color="blue.500" mr={2} />
            <Text fontSize="xl" fontWeight="bold" color="gray.800">Groups</Text>
          </Flex>
          {isAdmin && (
            <Tooltip label="Create New Group" placement="right">
              <Button size="sm" colorScheme="blue" variant="ghost" onClick={onOpen} borderRadius="full">
                <Icon as={FiPlus} fontSize="20px" />
              </Button>
            </Tooltip>
          )}
        </Flex>
  
        <Box flex="1" overflowY="auto" p={4} mb={16}>
          <VStack spacing={3} align="stretch">
            {groups.map((group) => (
              <Box key={group.id} p={4} cursor="pointer" borderRadius="lg" bg={group.isJoined ? "blue.50" : "gray.50"} borderWidth="1px" borderColor={group.isJoined ? "blue.200" : "gray.200"} _hover={{ transform: "translateY(-2px)", shadow: "md", borderColor: "blue.300" }}>
                <Flex justify="space-between" align="center">
                  <Box flex="1" onClick={() => handleAccessGroup(group.id)}>
                    <Flex align="center" mb={2}>
                      <Text fontWeight="bold" color="gray.800">{group.name}</Text>
                      {group.isJoined && <Badge ml={2} colorScheme="blue">Joined</Badge>}
                    </Flex>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>{group.description}</Text>
                  </Box>
  
                  <Button
                    size="sm"
                    colorScheme={group.isJoined ? "red" : "blue"}
                    variant={group.isJoined ? "ghost" : "solid"}
                    onClick={() => handleToggleJoin(group.id)}
                  >
                    {group.isJoined ? "Leave" : "Join"}
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
  
        <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
          <Button as={Link} to="/login" width="full" variant="ghost" colorScheme="red" leftIcon={<Icon as={FiLogOut} />}>Logout</Button>
        </Box>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Group Name</FormLabel>
                <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Enter group name" />
              </FormControl>
  
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} placeholder="Enter group description" />
              </FormControl>
  
              <Button colorScheme="blue" mr={3} mt={4} width="full" onClick={handleCreateGroup}>Create Group</Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default Sidebar;
  