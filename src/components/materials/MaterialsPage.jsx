import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Icon,
  Flex,
  Badge,
  Divider,
  Input,
  HStack,
  VStack,
  useColorModeValue,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Image,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { 
  FaGraduationCap, 
  FaBook, 
  FaDownload, 
  FaSearch, 
  FaStar, 
  FaFileAlt, 
  FaVideo,
  FaFilePdf,
  FaArrowRight
} from 'react-icons/fa';

const MaterialsPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Sample data for courses (in a real app, this would come from an API)
  const courses = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      description: "Comprehensive study materials for DSA including sorting algorithms, trees, graphs and complexity analysis.",
      type: "Course Materials",
      subject: "Computer Science",
      downloads: 1245,
      rating: 4.8,
      image: "https://img.freepik.com/free-vector/gradient-technological-background_23-2148884155.jpg"
    },
    {
      id: 2,
      title: "Advanced Database Systems",
      description: "Complete lecture notes covering relational and NoSQL databases, indexing, and query optimization.",
      type: "Lecture Notes",
      subject: "Software Engineering",
      downloads: 984,
      rating: 4.5,
      image: "https://img.freepik.com/free-vector/digital-technology-background-with-blue-orange-light-effect_1017-27428.jpg"
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML concepts including supervised and unsupervised learning algorithms.",
      type: "PDF",
      subject: "Artificial Intelligence",
      downloads: 2341,
      rating: 4.9,
      image: "https://img.freepik.com/free-vector/futuristic-background-with-glowing-lines_52683-55981.jpg"
    },
    {
      id: 4,
      title: "Calculus for Engineers",
      description: "Comprehensive study guide for engineering calculus with practice problems and solutions.",
      type: "Study Guide",
      subject: "Mathematics",
      downloads: 876,
      rating: 4.3,
      image: "https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148874123.jpg"
    },
    {
      id: 5,
      title: "Introduction to Quantum Computing",
      description: "Explore the fundamentals of quantum computing and quantum algorithms.",
      type: "Video Lectures",
      subject: "Physics",
      downloads: 1563,
      rating: 4.7,
      image: "https://img.freepik.com/free-vector/cyber-security-concept_23-2148532223.jpg"
    },
    {
      id: 6,
      title: "Web Development with React",
      description: "Complete guide to building modern web applications using React and related technologies.",
      type: "Tutorial",
      subject: "Web Development",
      downloads: 3120,
      rating: 4.6,
      image: "https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg"
    }
  ];
  
  // Featured materials - top 3 by downloads
  const featuredMaterials = [...courses]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  
  // Stats calculation
  const totalDownloads = courses.reduce((sum, course) => sum + course.downloads, 0);
  const averageRating = (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1);
  
  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      {/* Hero Section */}
      <Box
        bg="blue.600"
        color="white"
        py={12}
        px={4}
        backgroundImage="url('https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
        borderRadius="lg"
        mx={4}
        mb={12}
      >
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          bg="blue.900" 
          opacity={0.8} 
          borderRadius="lg"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
              <Heading size="2xl">Campus Learning Hub</Heading>
              <Text fontSize="xl" maxW="lg">
                Access quality academic resources, lecture notes, and study materials from our comprehensive collection.
              </Text>
              <Button 
                rightIcon={<FaArrowRight />} 
                colorScheme="white" 
                variant="outline"
                size="lg"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Browse All Materials
              </Button>
            </VStack>
            
            <Icon as={FaGraduationCap} boxSize={{ base: 16, md: 24 }} />
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl">
        {/* Stats Section */}
        <Box 
          mb={12} 
          p={6} 
          borderRadius="lg" 
          bg={cardBg} 
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
        >
          <StatGroup>
            <Stat>
              <StatLabel fontSize="lg">Academic Resources</StatLabel>
              <StatNumber fontSize="4xl" color="blue.500">{courses.length}+</StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="lg">Total Downloads</StatLabel>
              <StatNumber fontSize="4xl" color="green.500">{totalDownloads.toLocaleString()}</StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="lg">Average Rating</StatLabel>
              <StatNumber fontSize="4xl" color="yellow.500">
                {averageRating} <Icon as={FaStar} boxSize={6} color="yellow.400" />
              </StatNumber>
            </Stat>
          </StatGroup>
        </Box>
        
        {/* Search Bar */}
        <Flex 
          mb={12} 
          p={4} 
          borderRadius="lg" 
          bg={cardBg} 
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
          align="center"
        >
          <Icon as={FaSearch} boxSize={5} color="gray.500" mr={4} />
          <Input 
            placeholder="Search for courses, notes, study materials..." 
            size="lg" 
            variant="flushed" 
            _placeholder={{ color: 'gray.400' }}
          />
          <Button colorScheme="blue" ml={4} px={8}>
            Search
          </Button>
        </Flex>
        
        {/* Featured Materials */}
        <Box mb={12}>
          <Heading mb={6} size="xl" display="flex" alignItems="center">
            <Icon as={FaStar} color="yellow.400" mr={2} />
            Featured Resources
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {featuredMaterials.map(material => (
              <Card 
                key={material.id} 
                overflow="hidden" 
                variant="outline" 
                bg={cardBg}
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                height="100%"
              >
                <Box height="160px" overflow="hidden">
                  <Image 
                    src={material.image} 
                    alt={material.title}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                
                <CardHeader pb={0}>
                  <Flex justify="space-between" align="start">
                    <Heading size="md" noOfLines={2}>{material.title}</Heading>
                    <Badge colorScheme="blue" fontSize="0.8em" p={1} borderRadius="md">
                      {material.type}
                    </Badge>
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <Text noOfLines={3} color="gray.600">{material.description}</Text>
                  <HStack mt={4} spacing={4}>
                    <Badge colorScheme="purple">{material.subject}</Badge>
                    <Flex align="center">
                      <Icon as={FaStar} color="yellow.400" mr={1} />
                      <Text fontWeight="bold">{material.rating}</Text>
                    </Flex>
                  </HStack>
                </CardBody>
                
                <CardFooter pt={0}>
                  <Button colorScheme="blue" width="full" leftIcon={<FaDownload />}>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* All Materials */}
        <Box mb={12}>
          <Heading mb={6} size="xl" display="flex" alignItems="center">
            <Icon as={FaBook} color="blue.500" mr={2} />
            All Learning Materials
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {courses.map(material => (
              <Card 
                key={material.id} 
                borderRadius="lg" 
                overflow="hidden" 
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
                _hover={{ 
                  boxShadow: 'md',
                  transform: 'translateY(-3px)',
                  transition: 'all 0.3s ease' 
                }}
              >
                <CardHeader bg="blue.50" pb={2}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color="blue.700" noOfLines={2}>{material.title}</Heading>
                    <Icon 
                      as={material.type.includes('PDF') ? FaFilePdf : 
                          material.type.includes('Video') ? FaVideo : FaFileAlt} 
                      color="blue.600" 
                      boxSize={5}
                    />
                  </Flex>
                </CardHeader>
                
                <CardBody pt={3}>
                  <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                    {material.description}
                  </Text>
                  
                  <Flex justify="space-between" fontSize="sm" color="gray.500">
                    <Text>{material.subject}</Text>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text>{material.rating}</Text>
                    </HStack>
                  </Flex>
                </CardBody>
                
                <Divider />
                
                <CardFooter pt={3}>
                  <Flex w="100%" justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      <Icon as={FaDownload} mr={1} />
                      {material.downloads.toLocaleString()} downloads
                    </Text>
                    <Button size="sm" colorScheme="blue" variant="solid">
                      Access
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Call to Action */}
        <Box 
          p={8} 
          mb={8} 
          borderRadius="lg" 
          bg="blue.600" 
          color="white"
          textAlign="center"
        >
          <Heading size="lg" mb={4}>Ready to contribute?</Heading>
          <Text mb={6}>Share your own study materials and help other students in their learning journey.</Text>
          <Button colorScheme="white" variant="outline" size="lg">
            Upload Resources
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MaterialsPage; 