import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  VStack,
  useToast,
  Box,
  Flex,
  Text,
  Avatar
} from '@chakra-ui/react';
import { FiPlus, FiUsers } from 'react-icons/fi';

const GroupModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  newGroup, 
  setNewGroup, 
  handleCreateGroup 
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const groupIconInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGroup({
      ...newGroup,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleGroupIconSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "File too large",
        description: "Please select an image less than 2MB",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewGroup({...newGroup, icon: event.target.result});
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newGroup.name.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      handleCreateGroup(newGroup);
      
      // Reset form
      setNewGroup({
        name: '',
        description: '',
        isPrivate: false,
        icon: null,
        tags: ''
      });
      
      setIsLoading(false);
      onClose();
    }, 1000);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Group</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <Flex direction="column" align="center" mb={4}>
                <Box position="relative" cursor="pointer" onClick={() => groupIconInputRef.current?.click()}>
                  <Avatar 
                    size="xl" 
                    src={newGroup.icon} 
                    icon={<FiUsers size={40} />}
                    bg={newGroup.icon ? "transparent" : "purple.500"}
                  />
                  <Text fontSize="xs" mt={2} textAlign="center" color="gray.500">
                    Click to upload icon
                  </Text>
                  <input
                    type="file"
                    ref={groupIconInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleGroupIconSelect}
                  />
                </Box>
              </Flex>
            
              <FormControl isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input 
                  name="name"
                  value={newGroup.name}
                  onChange={handleChange}
                  placeholder="Enter a name for your group"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description"
                  value={newGroup.description}
                  onChange={handleChange}
                  placeholder="What is this group about?"
                  resize="none"
                  rows={3}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isPrivate" mb="0">
                  Private Group
                </FormLabel>
                <Switch 
                  id="isPrivate" 
                  name="isPrivate"
                  isChecked={newGroup.isPrivate}
                  onChange={handleChange}
                  colorScheme="purple"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Tags (Optional)</FormLabel>
                <Input 
                  name="tags"
                  value={newGroup.tags}
                  onChange={handleChange}
                  placeholder="Separate tags with commas"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Example: programming, study-group, project
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="purple" 
              type="submit"
              isLoading={isLoading}
              leftIcon={<FiPlus />}
            >
              Create Group
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default GroupModal; 