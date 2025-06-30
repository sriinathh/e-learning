import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Icon,
  Badge,
  HStack,
  VStack,
  Progress,
  Divider,
  useColorModeValue,
  Image,
  SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiBook,
  FiCalendar,
  FiClipboard,
  FiFileText,
  FiUsers,
  FiClock,
  FiPaperclip,
  FiEdit,
  FiPieChart,
  FiAward,
  FiCheckCircle,
  FiUpload,
  FiPlus,
  FiMessageCircle,
  FiSettings,
  FiMoreVertical,
  FiStar
} from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Module Card Component
const ModuleCard = ({ title, icon, description, colorScheme, progress, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <MotionBox
      as={Card}
      whileHover={{ y: -5, boxShadow: 'lg' }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      cursor="pointer"
      onClick={onClick}
      h="100%"
    >
      <Box h="8px" bgGradient={`linear(to-r, ${colorScheme}.400, ${colorScheme}.300)`} />
      <CardHeader pb={2}>
        <Flex alignItems="center" gap={3}>
          <Flex
            w="50px"
            h="50px"
            borderRadius="md"
            bg={`${colorScheme}.100`}
            color={`${colorScheme}.500`}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={6} />
          </Flex>
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        <Text color="gray.600" fontSize="sm">
          {description}
        </Text>
        {progress !== undefined && (
          <Box mt={4}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="medium">Progress</Text>
              <Text fontSize="xs" fontWeight="medium">{progress}%</Text>
            </Flex>
            <Progress value={progress} size="sm" colorScheme={colorScheme} borderRadius="full" />
          </Box>
        )}
      </CardBody>
      <CardFooter pt={0}>
        <Button variant="ghost" colorScheme={colorScheme} size="sm" rightIcon={<Icon as={FiEdit} />}>
          Manage
        </Button>
      </CardFooter>
    </MotionBox>
  );
};

// Upcoming Tasks Component
const UpcomingTasks = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  const tasks = [
    { 
      title: 'Upload Physics Quiz Papers', 
      dueDate: 'Today', 
      course: 'Physics 101', 
      priority: 'High',
      priorityColor: 'red'
    },
    { 
      title: 'Mark Programming Assignment', 
      dueDate: 'Tomorrow', 
      course: 'CS Fundamentals', 
      priority: 'Medium',
      priorityColor: 'orange'
    },
    { 
      title: 'Submit Monthly Progress Report', 
      dueDate: 'In 3 days', 
      course: 'Department', 
      priority: 'Medium',
      priorityColor: 'orange'
    },
    { 
      title: 'Update Timetable for Next Week', 
      dueDate: 'In 5 days', 
      course: 'Admin', 
      priority: 'Low',
      priorityColor: 'green'
    },
  ];
  
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="xl" boxShadow="md">
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <Heading size="md">Upcoming Tasks</Heading>
          <Button size="sm" colorScheme="blue" variant="ghost">View All</Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          {tasks.map((task, index) => (
            <Box 
              key={index} 
              p={3} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor={borderColor}
              _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
              transition="all 0.2s"
            >
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="medium">{task.title}</Text>
                <Badge colorScheme={task.priorityColor}>{task.priority}</Badge>
              </Flex>
              <Flex justify="space-between" fontSize="sm" color="gray.500">
                <HStack>
                  <Icon as={FiCalendar} />
                  <Text>{task.dueDate}</Text>
                </HStack>
                <Text>{task.course}</Text>
              </Flex>
            </Box>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Stats Cards
const StatsCard = ({ title, stat, icon, colorScheme }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="xl" boxShadow="md">
      <CardBody>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.500">{title}</Text>
            <Text fontSize="2xl" fontWeight="bold">{stat}</Text>
          </VStack>
          <Flex
            w="50px"
            h="50px"
            borderRadius="md"
            bg={`${colorScheme}.100`}
            color={`${colorScheme}.500`}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={6} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

const SimpleCourse = () => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [userRole, setUserRole] = useState('admin'); // Can be 'admin', 'faculty', or 'student'
  
  const academicModules = [
    {
      title: 'Course Management',
      icon: FiBook,
      description: 'Add and manage subjects, syllabi, and faculty assignments.',
      colorScheme: 'blue',
      progress: 75,
    },
    {
      title: 'Attendance Tracker',
      icon: FiClipboard,
      description: 'Faculty can mark attendance and students can view their logs.',
      colorScheme: 'green',
      progress: 90,
    },
    {
      title: 'Timetable Scheduler',
      icon: FiCalendar,
      description: 'Auto-generate or manually create class timetables.',
      colorScheme: 'purple',
      progress: 60,
    },
    {
      title: 'Exam & Results',
      icon: FiFileText,
      description: 'Upload marks, generate report cards and analyze performance.',
      colorScheme: 'orange',
      progress: 85,
    },
  ];
  
  const facultyModules = [
    {
      title: 'Lesson Planner',
      icon: FiClock,
      description: 'Plan daily and weekly lectures with objectives and materials.',
      colorScheme: 'teal',
      progress: 70,
    },
    {
      title: 'Faculty Dashboard',
      icon: FiPieChart,
      description: 'View teaching hours, student progress, and feedback stats.',
      colorScheme: 'cyan',
      progress: 95,
    },
    {
      title: 'Notes & Materials',
      icon: FiUpload,
      description: 'Upload class notes, assignments, and presentations.',
      colorScheme: 'pink',
      progress: 80,
    },
    {
      title: 'Performance Tracker',
      icon: FiAward,
      description: 'Track student performance and identify improvement areas.',
      colorScheme: 'yellow',
      progress: 65,
    },
  ];

  // Admin & Control Modules
  const adminModules = [
    {
      title: 'Role-Based Access',
      icon: FiUsers,
      description: 'Manage permissions and access for admin, faculty, and students.',
      colorScheme: 'red',
      progress: 85,
    },
    {
      title: 'Analytics & Reports',
      icon: FiPieChart,
      description: 'View graphs and statistics for attendance, marks, and platform usage.',
      colorScheme: 'purple',
      progress: 70,
    },
    {
      title: 'Feedback System',
      icon: FiMessageCircle,
      description: 'Collect and review anonymous feedback from students and faculty.',
      colorScheme: 'orange',
      progress: 60,
    },
    {
      title: 'System Settings',
      icon: FiSettings,
      description: 'Configure global settings, notifications, and integrations.',
      colorScheme: 'blue',
      progress: 90,
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
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
            <Heading size="xl" fontWeight="bold">
              Course Management System
            </Heading>
            <Text mt={2} color="gray.600">
              Manage your academic and faculty resources effectively
            </Text>
          </Box>
        </Flex>
        
        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5} mb={8}>
          <StatsCard 
            title="Active Courses" 
            stat="24" 
            icon={FiBook} 
            colorScheme="blue" 
          />
          <StatsCard 
            title="Faculty Members" 
            stat="42" 
            icon={FiUsers} 
            colorScheme="purple" 
          />
          <StatsCard 
            title="Students Enrolled" 
            stat="876" 
            icon={FiUsers} 
            colorScheme="green" 
          />
          <StatsCard 
            title="Upcoming Exams" 
            stat="12" 
            icon={FiFileText} 
            colorScheme="orange" 
          />
        </SimpleGrid>
        
        <Tabs 
          variant="soft-rounded" 
          colorScheme="blue" 
          mb={8} 
          onChange={(index) => setActiveTab(index)}
        >
          <TabList>
            <Tab>📚 Academic Modules</Tab>
            <Tab>👨‍🏫 Faculty Modules</Tab>
            <Tab>🔐 Admin & Control</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
                gap={6}
              >
                {academicModules.map((module, index) => (
                  <GridItem key={index}>
                    <ModuleCard {...module} />
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel px={0}>
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
                gap={6}
              >
                {facultyModules.map((module, index) => (
                  <GridItem key={index}>
                    <ModuleCard {...module} />
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel px={0}>
              {/* Role-based access warning/selector */}
              <Box mb={6} p={4} borderRadius="md" bg={userRole === 'admin' ? 'green.50' : 'yellow.50'} borderWidth="1px" borderColor={userRole === 'admin' ? 'green.200' : 'yellow.200'}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Box>
                    <Heading size="sm" mb={1}>
                      {userRole === 'admin' 
                        ? 'Admin Access Granted' 
                        : 'Restricted Access'}
                    </Heading>
                    <Text fontSize="sm">
                      {userRole === 'admin' 
                        ? 'You have full administrative privileges.' 
                        : 'Some features may be limited based on your role.'}
                    </Text>
                  </Box>
                  <Box>
                    <Button size="sm" colorScheme="blue" onClick={() => setUserRole(userRole === 'admin' ? 'faculty' : 'admin')}>
                      {userRole === 'admin' ? 'Switch to Faculty View' : 'Switch to Admin View'}
                    </Button>
                  </Box>
                </Flex>
              </Box>
            
              {/* Admin modules */}
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
                gap={6}
                opacity={userRole === 'admin' ? 1 : 0.6}
                pointerEvents={userRole === 'admin' ? 'auto' : 'none'}
              >
                {adminModules.map((module, index) => (
                  <GridItem key={index}>
                    <ModuleCard {...module} />
                  </GridItem>
                ))}
              </Grid>
              
              {/* Analytics Preview (shown to all roles but with different data) */}
              <Box mt={8}>
                <Heading size="md" mb={4}>Analytics Overview</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Attendance Analytics */}
                  <Card>
                    <CardHeader>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Heading size="sm">Attendance Analytics</Heading>
                        <HStack>
                          <Badge colorScheme="green">76% Average</Badge>
                          <Icon as={FiMoreVertical} cursor="pointer" />
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Box h="200px" position="relative" mt={2}>
                        {/* Simulated chart - replace with actual chart component */}
                        <Flex h="100%" alignItems="flex-end">
                          {[65, 70, 85, 75, 90, 60, 78].map((value, i) => (
                            <Box 
                              key={i}
                              h={`${value}%`}
                              w="full"
                              bg={`${i % 2 === 0 ? 'blue' : 'teal'}.${value > 75 ? '400' : '300'}`}
                              borderRadius="md"
                              mx={1}
                              transition="height 0.3s ease"
                              _hover={{ opacity: 0.8 }}
                            />
                          ))}
                        </Flex>
                        <Flex position="absolute" bottom="-25px" w="100%" justifyContent="space-between" px={1}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <Text key={i} fontSize="xs" color="gray.500">{day}</Text>
                          ))}
                        </Flex>
                      </Box>
                    </CardBody>
                  </Card>
                  
                  {/* Performance Analytics */}
                  <Card>
                    <CardHeader>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Heading size="sm">Performance Analytics</Heading>
                        <HStack>
                          <Badge colorScheme="purple">Last Updated: Today</Badge>
                          <Icon as={FiMoreVertical} cursor="pointer" />
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Flex justifyContent="space-between" h="200px" align="center">
                        {/* Simplified donut chart representation */}
                        <Box position="relative" w="150px" h="150px">
                          <Box 
                            position="absolute"
                            w="150px"
                            h="150px"
                            borderRadius="full"
                            background="conic-gradient(#805AD5 0% 70%, #E9D8FD 70% 100%)"
                          />
                          <Flex 
                            position="absolute"
                            w="110px"
                            h="110px"
                            borderRadius="full"
                            bg="white"
                            top="20px"
                            left="20px"
                            align="center"
                            justify="center"
                          >
                            <Text fontWeight="bold" fontSize="xl">70%</Text>
                          </Flex>
                        </Box>
                        
                        <VStack spacing={2} align="start">
                          <HStack>
                            <Box w="12px" h="12px" borderRadius="sm" bg="purple.500" />
                            <Text fontSize="sm">Excellent (70%)</Text>
                          </HStack>
                          <HStack>
                            <Box w="12px" h="12px" borderRadius="sm" bg="purple.200" />
                            <Text fontSize="sm">Average (30%)</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={2}>Based on 120 students</Text>
                        </VStack>
                      </Flex>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </Box>
              
              {/* Feedback System Preview */}
              <Box mt={8}>
                <Heading size="md" mb={4}>Recent Feedback</Heading>
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
                  {[
                    { text: "The new lecture format is much more engaging and interactive.", rating: 5, course: "Physics 101", userType: "Student" },
                    { text: "Assignment deadlines are too tight. Please consider extending them.", rating: 3, course: "Programming Fundamentals", userType: "Student" },
                    { text: "The grading system needs more transparency for students to understand their performance.", rating: 4, course: "System Feedback", userType: "Faculty" }
                  ].map((feedback, idx) => (
                    <Card key={idx}>
                      <CardBody>
                        <Flex direction="column" h="100%">
                          <HStack mb={2}>
                            {Array(5).fill('').map((_, i) => (
                              <Icon 
                                key={i} 
                                as={FiStar} 
                                color={i < feedback.rating ? 'orange.400' : 'gray.200'} 
                              />
                            ))}
                          </HStack>
                          <Text flex="1" fontSize="sm" mb={4}>"{feedback.text}"</Text>
                          <Flex justifyContent="space-between" fontSize="xs" color="gray.500">
                            <Text>{feedback.course}</Text>
                            <Badge colorScheme={feedback.userType === 'Student' ? 'green' : 'blue'}>
                              {feedback.userType}
                            </Badge>
                          </Flex>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Active Courses */}
          <Card>
            <CardHeader>
              <Heading size="md">Active Courses</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                {[
                  { name: 'Introduction to Computer Science', code: 'CS101', students: 45, progress: 65, color: 'blue' },
                  { name: 'Advanced Mathematics', code: 'MATH205', students: 38, progress: 72, color: 'purple' },
                  { name: 'Physics for Engineers', code: 'PHY150', students: 52, progress: 58, color: 'green' },
                  { name: 'Data Structures and Algorithms', code: 'CS202', students: 36, progress: 80, color: 'cyan' },
                ].map((course, i) => (
                  <Box 
                    key={i} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    borderColor="gray.200"
                    _hover={{ boxShadow: "md", borderColor: `${course.color}.200` }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center" mb={3}>
                      <VStack align="start" spacing={0}>
                        <Heading size="sm">{course.name}</Heading>
                        <Text fontSize="sm" color="gray.500">{course.code}</Text>
                      </VStack>
                      <HStack>
                        <Icon as={FiUsers} />
                        <Text fontSize="sm">{course.students} students</Text>
                      </HStack>
                    </Flex>
                    <Box>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs">Course Progress</Text>
                        <Text fontSize="xs" fontWeight="bold">{course.progress}%</Text>
                      </Flex>
                      <Progress value={course.progress} size="sm" colorScheme={course.color} borderRadius="full" />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </CardBody>
            <CardFooter pt={0}>
              <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue" variant="ghost">
                Add New Course
              </Button>
            </CardFooter>
          </Card>
          
          {/* Upcoming Tasks */}
          <UpcomingTasks />
        </Grid>
      </MotionFlex>
    </Box>
  );
};

export default SimpleCourse; 