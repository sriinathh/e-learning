// File: /src/components/CompanyInsights.jsx
import React from 'react';
import {
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Image, 
  Flex,
  Badge,
  VStack,
  HStack,
  Icon,
  Link,
  Button,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag
} from '@chakra-ui/react';
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaGlobe, FaDollarSign, FaStar } from 'react-icons/fa';

const CompanyInsights = () => {
  // Sample company data
  const companies = [
    {
      id: 1,
      name: 'TechCorp',
      logo: 'https://bit.ly/tech-corp-logo',
      description: 'Leading technology solutions provider with expertise in AI and cloud computing.',
      location: 'Bangalore, India',
      employees: '10,000+',
      industry: 'Information Technology',
      founded: 2005,
      website: 'https://techcorp-example.com',
      rating: 4.2,
      salaryRange: '₹8-25 LPA',
      hiringRounds: ['Online Assessment', 'Technical Interview', 'HR Round'],
      skills: ['Java', 'Python', 'React', 'Cloud', 'AI/ML']
    },
    {
      id: 2,
      name: 'FinTech Solutions',
      logo: 'https://bit.ly/fintech-logo',
      description: 'Innovative financial technology company revolutionizing digital payments and banking.',
      location: 'Mumbai, India',
      employees: '5,000+',
      industry: 'Financial Technology',
      founded: 2010,
      website: 'https://fintech-example.com',
      rating: 4.0,
      salaryRange: '₹10-20 LPA',
      hiringRounds: ['Aptitude Test', 'Case Study', 'Technical + HR Round'],
      skills: ['Financial Analysis', 'Data Science', 'SQL', 'Risk Management']
    },
    {
      id: 3,
      name: 'HealthTech Innovations',
      logo: 'https://bit.ly/health-tech-logo',
      description: 'Healthcare technology company focused on improving patient care through digital solutions.',
      location: 'Hyderabad, India',
      employees: '2,500+',
      industry: 'Healthcare Technology',
      founded: 2015,
      website: 'https://healthtech-example.com',
      rating: 4.5,
      salaryRange: '₹9-18 LPA',
      hiringRounds: ['Technical Assessment', 'Domain Knowledge Test', 'Panel Interview'],
      skills: ['Healthcare Informatics', 'Data Analysis', 'Electronic Health Records', 'UI/UX']
    },
    {
      id: 4,
      name: 'EduLearn Systems',
      logo: 'https://bit.ly/edulearn-logo',
      description: 'Educational technology platform providing online learning solutions for students worldwide.',
      location: 'Pune, India',
      employees: '1,200+',
      industry: 'Education Technology',
      founded: 2012,
      website: 'https://edulearn-example.com',
      rating: 3.9,
      salaryRange: '₹7-15 LPA',
      hiringRounds: ['Coding Challenge', 'Teaching Demo', 'HR Interview'],
      skills: ['Educational Content Development', 'Full Stack Development', 'UX Research']
    }
  ];

  return (
    <Box>
      <Heading mb={6}>Company Insights</Heading>
      <Text mb={8} color="gray.600">
        Research top companies, their hiring process, and prepare for your dream job.
      </Text>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {companies.map(company => (
          <Card key={company.id} boxShadow="md" borderRadius="lg" overflow="hidden">
            <CardBody>
              <Flex mb={4} align="center">
                <Box
                  boxSize="60px"
                  bg="gray.100"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={4}
                >
                  <Icon as={FaBuilding} boxSize={6} color="blue.500" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md">{company.name}</Heading>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="gray.500" size="sm" />
                    <Text fontSize="sm" color="gray.500">{company.location}</Text>
                  </HStack>
                </VStack>
                <Badge ml="auto" colorScheme="green" fontSize="0.8em" borderRadius="full" px={2}>
                  Actively Hiring
                </Badge>
              </Flex>
              
              <Text mb={4} noOfLines={2}>{company.description}</Text>
              
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <Stat size="sm">
                  <StatLabel>Founded</StatLabel>
                  <StatNumber>{company.founded}</StatNumber>
                </Stat>
                <Stat size="sm">
                  <StatLabel>Employees</StatLabel>
                  <StatNumber>{company.employees}</StatNumber>
                </Stat>
                <Stat size="sm">
                  <StatLabel>Rating</StatLabel>
                  <HStack>
                    <StatNumber>{company.rating}</StatNumber>
                    <Icon as={FaStar} color="yellow.400" />
                  </HStack>
                </Stat>
                <Stat size="sm">
                  <StatLabel>Salary Range</StatLabel>
                  <StatNumber>{company.salaryRange}</StatNumber>
                </Stat>
              </SimpleGrid>
              
              <Divider mb={4} />
              
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>Key Skills Required:</Text>
                <Flex wrap="wrap" gap={2}>
                  {company.skills.map((skill, index) => (
                    <Tag key={index} colorScheme="blue" size="sm">{skill}</Tag>
                  ))}
                </Flex>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>Hiring Process:</Text>
                <HStack spacing={2} overflowX="auto" pb={2}>
                  {company.hiringRounds.map((round, index) => (
                    <Flex key={index} direction="column" align="center" minW="100px">
                      <Box 
                        w="30px" 
                        h="30px" 
                        borderRadius="full" 
                        bg="blue.500" 
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={1}
                      >
                        {index + 1}
                      </Box>
                      <Text fontSize="xs" textAlign="center">{round}</Text>
                    </Flex>
                  ))}
                </HStack>
              </Box>
            </CardBody>
            
            <CardFooter pt={0}>
              <Button variant="solid" colorScheme="blue" size="sm">
                View Full Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CompanyInsights;
