import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  HStack,
  VStack,
  Badge,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Image,
  Divider,
  Table,
  Tbody,
  Tr,
  Td,
  Tag
} from '@chakra-ui/react';
import { 
  FaStar, 
  FaDownload, 
  FaThumbsUp, 
  FaFilePdf, 
  FaFileVideo, 
  FaFilePowerpoint, 
  FaFile,
  FaUser,
  FaCalendarAlt,
  FaGraduationCap,
  FaUniversity,
  FaBook,
  FaShareAlt,
  FaInfoCircle,
  FaEye
} from 'react-icons/fa';

const MaterialDetailModal = ({ isOpen, onClose, material, onRatingChange, onLike, onDownload }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const toast = useToast();

  if (!material) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return FaFilePdf;
      case 'video': return FaFileVideo;
      case 'ppt': return FaFilePowerpoint;
      default: return FaFile;
    }
  };

  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const handleRating = async (rating) => {
    try {
      const response = await axios.post(`/api/materials/${material._id}/rate`, { rating });
      onRatingChange(response.data.data);
      
      toast({
        title: 'Rating Submitted',
        description: `You rated this material ${rating} stars`,
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error rating material:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Material link copied to clipboard',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  const bgColorByFileType = (fileType) => {
    switch(fileType) {
      case 'pdf': return 'red.50';
      case 'video': return 'blue.50';
      case 'ppt': return 'orange.50';
      default: return 'gray.50';
    }
  };

  const colorByFileType = (fileType) => {
    switch(fileType) {
      case 'pdf': return 'red.500';
      case 'video': return 'blue.500';
      case 'ppt': return 'orange.500';
      default: return 'gray.500';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="blue.50" px={6} py={4}>
          <HStack mb={1}>
            <Icon as={getFileIcon(material.fileType)} color={colorByFileType(material.fileType)} />
            <Text color="blue.700" fontSize="sm">{material.fileType.toUpperCase()} Resource</Text>
          </HStack>
          <Heading size="md">{material.title}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={0}>
          <Flex direction="column">
            {/* Top Banner */}
            <Box 
              bg={bgColorByFileType(material.fileType)} 
              p={6} 
              textAlign="center"
            >
              <VStack spacing={3}>
                <Icon 
                  as={getFileIcon(material.fileType)} 
                  boxSize={20} 
                  color={colorByFileType(material.fileType)}
                />
                <Tag size="lg" variant="solid" colorScheme="blue">
                  {material.branch} • {material.subject}
                </Tag>
              </VStack>
            </Box>
            
            {/* Resource Information */}
            <Box p={6}>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaInfoCircle} mr={2} color="blue.500" />
                About This Resource
              </Heading>
              
              <Text whiteSpace="pre-wrap" mb={6} color="gray.700">
                {material.description}
              </Text>
              
              <Divider mb={4} />
              
              <Table variant="simple" size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold" width="120px">Author</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={FaUser} mr={2} color="blue.500" />
                        {material.uploadedBy?.name || 'EduConnect User'}
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Subject</Td>
                    <Td>
                      <Badge colorScheme="blue">{material.subject}</Badge>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Branch</Td>
                    <Td>
                      <Badge colorScheme="purple">{material.branch}</Badge>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Date Added</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={FaCalendarAlt} mr={2} color="green.500" />
                        {formatDate(material.createdAt)}
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Downloads</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={FaDownload} mr={2} color="green.500" />
                        {material.downloads} downloads
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Likes</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={FaThumbsUp} mr={2} color="blue.500" />
                        {material.likes?.length || 0} likes
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            
            {/* Rating Section */}
            <Box bg="gray.50" p={6} borderTop="1px" borderColor="gray.200">
              <VStack align="stretch" spacing={4}>
                <Heading size="sm" mb={2}>Rate this learning resource</Heading>
                
                <HStack spacing={2} justifyContent="center" mb={2}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Icon 
                      key={star}
                      as={FaStar} 
                      boxSize={8}
                      color={hoveredRating >= star ? "yellow.400" : "gray.200"}
                      cursor="pointer"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </HStack>
                
                <Flex 
                  justify="center" 
                  align="center" 
                  bg="blue.50" 
                  py={3} 
                  px={4} 
                  borderRadius="md"
                >
                  <Text fontWeight="bold" fontSize="xl" color="blue.700" mr={2}>
                    {getAverageRating(material.ratings)}
                  </Text>
                  <Text>
                    average from {material.ratings?.length || 0} ratings
                  </Text>
                </Flex>
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
        
        <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200">
          <Button 
            leftIcon={<FaDownload />} 
            colorScheme="green"
            size="lg"
            flex={1}
            mr={3}
            onClick={() => onDownload(material._id, material.fileUrl)}
          >
            Download Resource
          </Button>
          
          <HStack>
            <Button 
              leftIcon={<FaThumbsUp />} 
              colorScheme="blue" 
              variant="outline"
              onClick={() => onLike(material._id)}
            >
              Like
            </Button>
            
            <Button
              leftIcon={<FaShareAlt />}
              variant="outline"
              onClick={handleShare}
            >
              Share
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MaterialDetailModal; 