import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; 
import {
  Box,
  Heading,
  VStack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Container
} from '@chakra-ui/react';
import './Placement.css';
import JobOpportunities from './JobOpportunities';
import ResumeBuilder from './ResumeBuilder';
import InterviewPrep from './InterviewPrep';
import SupportForm from './SupportForm';
import CompanyInsights from './CompanyInsights';
import UpcomingDrives from './UpcomingDrives';
import CareerRoadmap from './CareerRoadmap';
import { FaBriefcase, FaFileAlt, FaMicrophone, FaBuilding, FaHeadset, FaCalendarAlt, FaRoad } from 'react-icons/fa';

const PlacementHub = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  // Background colors
  const bgGradient = useColorModeValue(
    'linear(135deg, blue.500, purple.600)',
    'linear(135deg, blue.800, purple.900)'
  );
  
  const bgCard = useColorModeValue('white', 'gray.800');
  
  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  return (
    <Box 
      className="placement-hub" 
      bgGradient={bgGradient}
      minH="100vh" 
      py={8}
    >
      <Container maxW="container.xl">
        <Flex direction="column" align="center" justify="center">
          <Heading 
            as="h1" 
            size="xl" 
            mb={8} 
            color="white" 
            textAlign="center"
            fontWeight="bold"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
          >
            Welcome to CampusConnect Placement Hub
          </Heading>

          <Box 
            bg={bgCard} 
            borderRadius="xl" 
            boxShadow="xl" 
            overflow="hidden" 
            w="100%"
          >
            <Tabs 
              variant="soft-rounded" 
              colorScheme="blue" 
              isLazy
              index={selectedTab}
              onChange={handleTabChange}
              padding={4}
            >
              <TabList 
                overflowX="auto" 
                py={2} 
                px={4} 
                gap={2}
                className="placement-tablist"
              >
                <Tab gap={2}>
                  <Icon as={FaCalendarAlt} />
                  <Text>Upcoming Drives</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaRoad} />
                  <Text>Career Roadmap</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaBriefcase} />
                  <Text>Job Opportunities</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaFileAlt} />
                  <Text>Resume Builder</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaMicrophone} />
                  <Text>Mock Interviews</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaBuilding} />
                  <Text>Company Insights</Text>
                </Tab>
                <Tab gap={2}>
                  <Icon as={FaHeadset} />
                  <Text>Placement Support</Text>
                </Tab>
              </TabList>

              <TabPanels p={4}>
                <TabPanel>
                  <UpcomingDrives />
                </TabPanel>
                <TabPanel>
                  <CareerRoadmap />
                </TabPanel>
                <TabPanel>
                  <JobOpportunities />
                </TabPanel>
                <TabPanel>
                  <ResumeBuilder />
                </TabPanel>
                <TabPanel>
                  <InterviewPrep />
                </TabPanel>
                <TabPanel>
                  <CompanyInsights />
                </TabPanel>
                <TabPanel>
                  <SupportForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default PlacementHub;
