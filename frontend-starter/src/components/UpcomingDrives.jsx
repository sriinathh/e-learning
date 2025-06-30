import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Icon,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  useColorModeValue,
  Tag,
  Avatar,
  AvatarGroup,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiBookmark, FiCheckCircle, FiExternalLink } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const DriveCard = ({ drive, index }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColors = ['purple.500', 'blue.500', 'teal.500', 'cyan.500', 'green.500'];
  const accentColor = accentColors[index % accentColors.length];
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Upcoming':
        return <Badge colorScheme="purple">Upcoming</Badge>;
      case 'Registration Open':
        return <Badge colorScheme="green">Registration Open</Badge>;
      case 'Closing Soon':
        return <Badge colorScheme="orange">Closing Soon</Badge>;
      default:
        return <Badge colorScheme="gray">TBD</Badge>;
    }
  };

  return (
    <>
      <MotionBox
        whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="md"
        p={0}
        onClick={onOpen}
        cursor="pointer"
        position="relative"
      >
        {/* Top gradient accent */}
        <Box h="6px" bgGradient={`linear(to-r, ${accentColor}, ${accentColor.split('.')[0]}.300)`} />
        
        {/* Card content */}
        <Box p={5}>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
            <VStack align="start" spacing={1}>
              <Heading size="md" color={textColor} isTruncated maxW="200px">
                {drive.company}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {drive.role}
              </Text>
            </VStack>
            {getStatusBadge(drive.status)}
          </Flex>
          
          <Divider my={3} />
          
          <VStack spacing={3} align="stretch">
            <HStack>
              <Icon as={FiCalendar} color={accentColor} />
              <Text fontSize="sm">{drive.date}</Text>
            </HStack>
            
            <HStack>
              <Icon as={FiMapPin} color={accentColor} />
              <Text fontSize="sm" isTruncated maxW="230px">{drive.location}</Text>
            </HStack>
            
            <HStack>
              <Icon as={FiUsers} color={accentColor} />
              <Text fontSize="sm">{drive.eligibility}</Text>
            </HStack>
          </VStack>
          
          <Divider my={3} />
          
          <Flex justifyContent="space-between" alignItems="center">
            <AvatarGroup size="sm" max={3}>
              {drive.participants.map((participant, i) => (
                <Avatar key={i} name={participant} />
              ))}
            </AvatarGroup>
            
            <HStack>
              <Tag size="sm" variant="subtle" colorScheme="gray">
                {drive.package}
              </Tag>
              <Icon as={FiBookmark} cursor="pointer" _hover={{ color: accentColor }} />
            </HStack>
          </Flex>
        </Box>
      </MotionBox>
      
      {/* Modal with drive details */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl">
          <Box h="8px" bgGradient={`linear(to-r, ${accentColor}, ${accentColor.split('.')[0]}.300)`} borderTopRadius="xl" />
          
          <ModalHeader>
            <Heading size="lg">{drive.company}</Heading>
            <Text mt={1} fontSize="md" color="gray.500">{drive.role}</Text>
          </ModalHeader>
          
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <Box>
                <Heading size="sm" mb={3}>Drive Details</Heading>
                <Grid templateColumns="120px 1fr" gap={4}>
                  <Text fontWeight="medium">Date & Time:</Text>
                  <HStack>
                    <Icon as={FiCalendar} color={accentColor} />
                    <Text>{drive.date}</Text>
                    <Icon as={FiClock} color={accentColor} ml={2} />
                    <Text>{drive.time || '10:00 AM'}</Text>
                  </HStack>
                  
                  <Text fontWeight="medium">Location:</Text>
                  <HStack>
                    <Icon as={FiMapPin} color={accentColor} />
                    <Text>{drive.location}</Text>
                  </HStack>
                  
                  <Text fontWeight="medium">Package:</Text>
                  <HStack>
                    <Tag size="md" variant="subtle" colorScheme="green">
                      {drive.package}
                    </Tag>
                  </HStack>
                  
                  <Text fontWeight="medium">Eligibility:</Text>
                  <HStack>
                    <Icon as={FiUsers} color={accentColor} />
                    <Text>{drive.eligibility}</Text>
                  </HStack>
                </Grid>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={3}>Job Description</Heading>
                <Text>
                  {drive.description || `We are looking for talented ${drive.role} to join our team. Candidates should be passionate about technology and innovation. This position offers the opportunity to work on cutting-edge projects in a collaborative environment.`}
                </Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={3}>Selection Process</Heading>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiCheckCircle} color={accentColor} />
                    <Text>Online Assessment</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color={accentColor} />
                    <Text>Technical Interview</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color={accentColor} />
                    <Text>HR Interview</Text>
                  </HStack>
                </VStack>
              </Box>
              
              <Box>
                <Heading size="sm" mb={3}>Participants</Heading>
                <AvatarGroup size="md" max={5}>
                  {drive.participants.map((participant, i) => (
                    <Avatar key={i} name={participant} />
                  ))}
                </AvatarGroup>
                <Text mt={2} fontSize="sm" color="gray.500">
                  {drive.participants.length} students have registered for this drive
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme={accentColor.split('.')[0]} 
              leftIcon={<FiExternalLink />}
              _hover={{ transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              Apply Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const UpcomingDrives = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  // Sample data
  const drives = [
    {
      company: 'Microsoft',
      role: 'Software Engineer',
      date: 'Oct 15, 2023',
      time: '10:00 AM',
      location: 'Main Campus Auditorium',
      package: '₹18-24 LPA',
      eligibility: 'CSE, IT, ECE (≥7.5 CGPA)',
      status: 'Registration Open',
      participants: ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams']
    },
    {
      company: 'Amazon',
      role: 'SDE Intern',
      date: 'Oct 18, 2023',
      time: '11:00 AM',
      location: 'Virtual (Microsoft Teams)',
      package: '₹12-15 LPA',
      eligibility: 'All Engineering (≥7.0 CGPA)',
      status: 'Upcoming',
      participants: ['Mike Brown', 'Emily Davis', 'David Wilson']
    },
    {
      company: 'Google',
      role: 'Product Manager',
      date: 'Oct 22, 2023',
      time: '9:30 AM',
      location: 'Tech Building, Room 302',
      package: '₹22-28 LPA',
      eligibility: 'CSE, IT, MBA (≥8.0 CGPA)',
      status: 'Closing Soon',
      participants: ['Chris Martin', 'Lisa Anderson', 'Kevin Taylor', 'Rachel Green', 'Tom Baker']
    },
    {
      company: 'Adobe',
      role: 'UX Designer',
      date: 'Oct 25, 2023',
      time: '2:00 PM',
      location: 'Design Lab',
      package: '₹14-18 LPA',
      eligibility: 'Design, CSE, IT (≥7.0 CGPA)',
      status: 'Registration Open',
      participants: ['James Wilson', 'Emma Thompson']
    },
    {
      company: 'Deloitte',
      role: 'Business Analyst',
      date: 'Nov 01, 2023',
      time: '10:30 AM',
      location: 'Business School Auditorium',
      package: '₹10-12 LPA',
      eligibility: 'All Streams (≥7.0 CGPA)',
      status: 'Upcoming',
      participants: ['Robert Johnson', 'Sophie Martin', 'Daniel Brown', 'Olivia Davis', 'Noah Wilson', 'Isabella Smith']
    }
  ];

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <MotionFlex
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        direction="column"
        maxW="1200px"
        mx="auto"
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading color={headingColor} size="xl" fontWeight="bold">
              Upcoming Placement Drives
            </Heading>
            <Text mt={2} color="gray.600">
              Stay updated with the latest campus recruitment opportunities
            </Text>
          </Box>
          
          <HStack>
            <Button 
              colorScheme="purple" 
              size="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              View All
            </Button>
          </HStack>
        </Flex>
        
        <Grid 
          templateColumns={["1fr", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]} 
          gap={6}
        >
          {drives.map((drive, index) => (
            <GridItem key={index}>
              <DriveCard drive={drive} index={index} />
            </GridItem>
          ))}
        </Grid>
      </MotionFlex>
    </Box>
  );
};

export default UpcomingDrives; 