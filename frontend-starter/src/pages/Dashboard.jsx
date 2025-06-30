import React from "react";
import { Box, Heading, Button, VStack, Grid, GridItem, Text, Icon, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiUsers, FiCpu, FiFileText, FiAward, FiBriefcase } from "react-icons/fi";

const Dashboard = () => {
  return (
    <Box p={8}>
      <Heading mb={6}>Student Dashboard</Heading>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiBookOpen} boxSize={10} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>Courses</Heading>
            <Text mb={4} textAlign="center">Browse and learn from our collection of courses</Text>
            <Button as={Link} to="/courses" colorScheme="blue" leftIcon={<FiBookOpen />}>
              Browse Courses
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiCpu} boxSize={10} color="teal.500" mb={4} />
            <Heading size="md" mb={2}>Campus AI</Heading>
            <Text mb={4} textAlign="center">Your personal AI assistant for learning</Text>
            <Button as={Link} to="/campusconnect" colorScheme="teal" leftIcon={<FiCpu />}>
              Talk to AI
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiUsers} boxSize={10} color="purple.500" mb={4} />
            <Heading size="md" mb={2}>Community</Heading>
            <Text mb={4} textAlign="center">Connect with peers and join study groups</Text>
            <Button as={Link} to="/community-full" colorScheme="purple" leftIcon={<FiUsers />}>
              Join Community
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiFileText} boxSize={10} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Materials</Heading>
            <Text mb={4} textAlign="center">Access learning materials and resources</Text>
            <Button as={Link} to="/materials" colorScheme="orange" leftIcon={<FiFileText />}>
              View Materials
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiBriefcase} boxSize={10} color="green.500" mb={4} />
            <Heading size="md" mb={2}>Placement</Heading>
            <Text mb={4} textAlign="center">Explore job opportunities and placements</Text>
            <Button as={Link} to="/placement" colorScheme="green" leftIcon={<FiBriefcase />}>
              Placement Hub
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="md"
            height="200px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Icon as={FiAward} boxSize={10} color="red.500" mb={4} />
            <Heading size="md" mb={2}>Certificates</Heading>
            <Text mb={4} textAlign="center">View your earned certificates</Text>
            <Button as={Link} to="/courses/certificate" colorScheme="red" leftIcon={<FiAward />}>
              View Certificates
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;
