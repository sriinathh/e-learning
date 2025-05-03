import React, { useState } from 'react';
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
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  useToast,
  Text,
  Box,
  FormHelperText
} from '@chakra-ui/react';

const CommunityModal = ({ isOpen, onClose, onSubmit }) => {
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommunityData({
      ...communityData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Add tag
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      
      // Don't add duplicate tags
      if (communityData.tags.includes(tagInput.trim())) {
        toast({
          title: 'Duplicate tag',
          description: 'This tag already exists',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      // Limit to 5 tags
      if (communityData.tags.length >= 5) {
        toast({
          title: 'Too many tags',
          description: 'You can add a maximum of 5 tags',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      setCommunityData({
        ...communityData,
        tags: [...communityData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Remove tag
  const removeTag = (tagToRemove) => {
    setCommunityData({
      ...communityData,
      tags: communityData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!communityData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a community name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(communityData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    setCommunityData({
      name: '',
      description: '',
      isPublic: true,
      tags: []
    });
    setTagInput('');
  };
  
  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Community</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Community Name</FormLabel>
              <Input
                name="name"
                value={communityData.name}
                onChange={handleChange}
                placeholder="Enter community name"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={communityData.description}
                onChange={handleChange}
                placeholder="Describe your community (optional)"
                resize="vertical"
                rows={3}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                placeholder="Add tags and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              <FormHelperText>
                Tags help others find your community (max 5)
              </FormHelperText>
              
              {communityData.tags.length > 0 && (
                <Flex mt={2} flexWrap="wrap" gap={2}>
                  {communityData.tags.map((tag, index) => (
                    <Tag key={index} colorScheme="blue" size="md">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(tag)} />
                    </Tag>
                  ))}
                </Flex>
              )}
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <Switch
                id="isPublic"
                name="isPublic"
                isChecked={communityData.isPublic}
                onChange={handleChange}
                colorScheme="blue"
                mr={3}
              />
              <FormLabel htmlFor="isPublic" mb={0}>
                Public Community
              </FormLabel>
            </FormControl>
            
            {!communityData.isPublic && (
              <Box width="100%" bg="yellow.50" p={3} borderRadius="md">
                <Text fontSize="sm">
                  Private communities are only visible to members and require an invitation to join.
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit} 
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommunityModal; 