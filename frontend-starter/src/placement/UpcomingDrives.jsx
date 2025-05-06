import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Divider,
  Flex,
  Tag,
  Avatar,
  Tooltip
} from '@chakra-ui/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaUsers, FaClock } from 'react-icons/fa';

const UpcomingDrives = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Sample placement drive data
  const upcomingDrives = [
    {
      id: 1,
      company: 'TechSolutions Inc.',
      logo: 'https://bit.ly/company-1',
      date: 'November 15, 2023',
      location: 'Virtual',
      positions: ['Software Engineer', 'Data Analyst'],
      eligibility: 'B.Tech/M.Tech (CS, IT)',
      package: '₹8-12 LPA',
      registrationDeadline: 'November 10, 2023',
      status: 'open'
    },
    {
      id: 2,
      company: 'Global Innovations',
      logo: 'https://bit.ly/company-2',
      date: 'November 22, 2023',
      location: 'Bangalore & Virtual',
      positions: ['Product Manager', 'UI/UX Designer'],
      eligibility: 'All Engineering Branches',
      package: '₹10-15 LPA',
      registrationDeadline: 'November 18, 2023',
      status: 'open'
    },
    {
      id: 3,
      company: 'Finance Solutions Ltd.',
      logo: 'https://bit.ly/company-3',
      date: 'November 30, 2023',
      location: 'Mumbai',
      positions: ['Financial Analyst', 'Business Analyst'],
      eligibility: 'B.Com, MBA',
      package: '₹7-9 LPA',
      registrationDeadline: 'November 25, 2023',
      status: 'open'
    },
    {
      id: 4,
      company: 'CloudTech Systems',
      logo: 'https://bit.ly/company-4',
      date: 'December 5, 2023',
      location: 'Virtual',
      positions: ['Cloud Engineer', 'DevOps Specialist'],
      eligibility: 'B.Tech/M.Tech (CS, IT, ECE)',
      package: '₹12-18 LPA',
      registrationDeadline: 'November 28, 2023',
      status: 'open'
    }
  ];

  return (
    <Box>
      <Heading size="lg" mb={6}>Upcoming Placement Drives</Heading>
      <Text mb={8} color="gray.600">
        Stay updated with all the upcoming campus placement drives and prepare accordingly.
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {upcomingDrives.map((drive) => (
          <Box 
            key={drive.id}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            p={5}
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <HStack>
                <Avatar name={drive.company} src={drive.logo} />
                <Box>
                  <Heading size="md">{drive.company}</Heading>
                  <HStack mt={1}>
                    <Icon as={FaMapMarkerAlt} color="gray.500" />
                    <Text fontSize="sm" color="gray.500">{drive.location}</Text>
                  </HStack>
                </Box>
              </HStack>
              <Badge 
                colorScheme={drive.status === 'open' ? 'green' : 'red'}
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="full"
              >
                {drive.status === 'open' ? 'Registration Open' : 'Closed'}
              </Badge>
            </Flex>
            
            <Divider mb={4} />
            
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FaCalendarAlt} color="blue.500" />
                <Text fontWeight="medium">Drive Date: {drive.date}</Text>
              </HStack>
              
              <HStack>
                <Icon as={FaBriefcase} color="purple.500" />
                <Text fontWeight="medium">Positions:</Text>
                <HStack spacing={1}>
                  {drive.positions.map((position, index) => (
                    <Tag key={index} size="sm" colorScheme="blue" borderRadius="full">
                      {position}
                    </Tag>
                  ))}
                </HStack>
              </HStack>
              
              <HStack>
                <Icon as={FaGraduationCap} color="green.500" />
                <Text fontWeight="medium">Eligibility: {drive.eligibility}</Text>
              </HStack>
              
              <HStack>
                <Icon as={FaUsers} color="orange.500" />
                <Text fontWeight="medium">Package: {drive.package}</Text>
              </HStack>
              
              <HStack>
                <Icon as={FaClock} color="red.500" />
                <Text fontWeight="medium">Registration Deadline: {drive.registrationDeadline}</Text>
              </HStack>
            </VStack>
            
            <Flex justify="space-between" mt={6}>
              <Button colorScheme="blue" size="sm">View Details</Button>
              <Button colorScheme="green" size="sm">Register Now</Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      
      <Box mt={8} p={4} bg="blue.50" borderRadius="md">
        <Flex align="center">
          <Icon as={FaCalendarAlt} color="blue.500" boxSize={6} mr={3} />
          <Box>
            <Heading size="sm">Pre-Placement Orientation Session</Heading>
            <Text mt={1}>Join us on November 5, 2023 for a session on how to prepare for the upcoming placement season.</Text>
          </Box>
          <Button ml="auto" colorScheme="blue" size="sm">RSVP</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default UpcomingDrives; 