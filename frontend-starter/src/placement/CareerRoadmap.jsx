import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Select,
  Button,
  Progress,
  Text,
  Badge,
  Grid,
  GridItem,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Tag,
  Flex,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Skeleton,
  Tooltip,
  Link
} from '@chakra-ui/react';
import { FaCheck, FaBook, FaLaptopCode, FaAward, FaHandshake, FaStar, FaBrain, FaTrophy, FaInfoCircle, FaRocket, FaGithub, FaLinkedin } from 'react-icons/fa';
import './CareerRoadmap.css';

// Sample Career Paths data
const careerPaths = [
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    description: 'Master data analysis, machine learning, and statistical modeling to extract insights from complex datasets',
    icon: FaBrain,
    color: 'purple.500',
    requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
    steps: [
      {
        id: 'ds_1',
        title: 'Learn Python Fundamentals',
        type: 'course',
        link: 'https://www.coursera.org/learn/python',
        completed: false,
        description: 'Master the basics of Python programming language',
        resources: [
          { name: 'Python Documentation', link: 'https://docs.python.org/3/' },
          { name: 'W3Schools Python Tutorial', link: 'https://www.w3schools.com/python/' }
        ]
      },
      {
        id: 'ds_2',
        title: 'Statistics and Probability',
        type: 'course',
        link: 'https://www.coursera.org/learn/probability-statistics',
        completed: false,
        description: 'Learn fundamental statistical concepts required for data science',
        resources: [
          { name: 'Khan Academy Statistics', link: 'https://www.khanacademy.org/math/statistics-probability' }
        ]
      },
      {
        id: 'ds_3',
        title: 'Data Wrangling Project',
        type: 'project',
        link: 'https://github.com/topics/data-wrangling',
        completed: false,
        description: 'Build a project cleaning and preprocessing messy datasets',
        resources: [
          { name: 'Pandas Documentation', link: 'https://pandas.pydata.org/docs/' }
        ]
      },
      {
        id: 'ds_4',
        title: 'Machine Learning Basics',
        type: 'course',
        link: 'https://www.coursera.org/learn/machine-learning',
        completed: false,
        description: 'Learn fundamental ML algorithms and techniques',
        resources: [
          { name: 'Scikit-Learn Documentation', link: 'https://scikit-learn.org/stable/' }
        ]
      },
      {
        id: 'ds_5',
        title: 'TensorFlow Certification',
        type: 'certification',
        link: 'https://www.tensorflow.org/certificate',
        completed: false,
        description: 'Get officially certified in TensorFlow',
        resources: [
          { name: 'TensorFlow Tutorials', link: 'https://www.tensorflow.org/tutorials' }
        ]
      }
    ]
  },
  {
    id: 'full_stack',
    title: 'Full Stack Developer',
    description: 'Build end-to-end web applications with expertise in both frontend and backend technologies',
    icon: FaLaptopCode,
    color: 'blue.500',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Databases', 'Git', 'APIs'],
    steps: [
      {
        id: 'fs_1',
        title: 'HTML, CSS & JavaScript Basics',
        type: 'course',
        link: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        completed: false,
        description: 'Learn the fundamentals of web development',
        resources: [
          { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/en-US/docs/Web' }
        ]
      },
      {
        id: 'fs_2',
        title: 'React Framework',
        type: 'course',
        link: 'https://react.dev/learn',
        completed: false,
        description: 'Master the React library for building user interfaces',
        resources: [
          { name: 'React Documentation', link: 'https://react.dev/reference/react' }
        ]
      },
      {
        id: 'fs_3',
        title: 'Node.js & Express',
        type: 'course',
        link: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
        completed: false,
        description: 'Learn server-side JavaScript using Node.js and Express',
        resources: [
          { name: 'Node.js Documentation', link: 'https://nodejs.org/en/docs/' }
        ]
      },
      {
        id: 'fs_4',
        title: 'Full Stack Project',
        type: 'project',
        link: 'https://github.com/topics/mern-stack',
        completed: false,
        description: 'Build a complete web application using the MERN stack',
        resources: [
          { name: 'MERN Stack Tutorial', link: 'https://www.mongodb.com/mern-stack' }
        ]
      },
      {
        id: 'fs_5',
        title: 'AWS Cloud Practitioner',
        type: 'certification',
        link: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        completed: false,
        description: 'Get certified in cloud services fundamentals',
        resources: [
          { name: 'AWS Documentation', link: 'https://docs.aws.amazon.com/' }
        ]
      }
    ]
  },
  {
    id: 'ux_designer',
    title: 'UX Designer',
    description: 'Create intuitive, accessible, and delightful user experiences through research, design, and testing',
    icon: FaHandshake,
    color: 'pink.500',
    requiredSkills: ['UI Design', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
    steps: [
      {
        id: 'ux_1',
        title: 'UX Fundamentals',
        type: 'course',
        link: 'https://www.coursera.org/professional-certificates/google-ux-design',
        completed: false,
        description: 'Learn UX design fundamentals and processes',
        resources: [
          { name: 'Nielsen Norman Group', link: 'https://www.nngroup.com/articles/' }
        ]
      },
      {
        id: 'ux_2',
        title: 'Figma Essential Training',
        type: 'course',
        link: 'https://www.linkedin.com/learning/figma-essential-training-the-basics',
        completed: false,
        description: 'Master the industry-standard design tool',
        resources: [
          { name: 'Figma Help Center', link: 'https://help.figma.com/' }
        ]
      },
      {
        id: 'ux_3',
        title: 'User Research Project',
        type: 'project',
        link: 'https://www.uxportfolio.com/',
        completed: false,
        description: 'Conduct user research and usability testing',
        resources: [
          { name: 'UX Research Methods', link: 'https://www.nngroup.com/articles/which-ux-research-methods/' }
        ]
      },
      {
        id: 'ux_4',
        title: 'Mobile App Redesign',
        type: 'project',
        link: 'https://dribbble.com/',
        completed: false,
        description: 'Redesign an existing mobile app with improved UX',
        resources: [
          { name: 'Mobile UX Design Principles', link: 'https://www.toptal.com/designers/mobile-ui/mobile-ux-design-principles' }
        ]
      },
      {
        id: 'ux_5',
        title: 'Interaction Design Foundation Certification',
        type: 'certification',
        link: 'https://www.interaction-design.org/courses/ux-design-certification',
        completed: false,
        description: 'Get certified in UX design principles',
        resources: [
          { name: 'IDF Library', link: 'https://www.interaction-design.org/literature' }
        ]
      }
    ]
  },
  {
    id: 'cyber_security',
    title: 'Cybersecurity Expert',
    description: 'Protect systems, networks, and programs from digital attacks',
    icon: FaInfoCircle,
    color: 'red.500',
    requiredSkills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Security Tools', 'Cryptography'],
    steps: [
      {
        id: 'cs_1',
        title: 'Cybersecurity Fundamentals',
        type: 'course',
        link: 'https://www.coursera.org/learn/cyber-security-basics',
        completed: false,
        description: 'Learn the basics of cybersecurity principles',
        resources: [
          { name: 'NIST Cybersecurity Framework', link: 'https://www.nist.gov/cyberframework' }
        ]
      },
      {
        id: 'cs_2',
        title: 'Network Security',
        type: 'course',
        link: 'https://www.udemy.com/course/network-security-course/',
        completed: false,
        description: 'Master network security concepts and implementation',
        resources: [
          { name: 'Wireshark Documentation', link: 'https://www.wireshark.org/docs/' }
        ]
      },
      {
        id: 'cs_3',
        title: 'Vulnerability Assessment Project',
        type: 'project',
        link: 'https://github.com/topics/vulnerability-assessment',
        completed: false,
        description: 'Perform a vulnerability assessment on a system',
        resources: [
          { name: 'OWASP Top Ten', link: 'https://owasp.org/www-project-top-ten/' }
        ]
      },
      {
        id: 'cs_4',
        title: 'Ethical Hacking',
        type: 'course',
        link: 'https://www.udemy.com/course/learn-ethical-hacking-from-scratch/',
        completed: false,
        description: 'Learn ethical hacking techniques and tools',
        resources: [
          { name: 'Kali Linux Documentation', link: 'https://www.kali.org/docs/' }
        ]
      },
      {
        id: 'cs_5',
        title: 'CompTIA Security+ Certification',
        type: 'certification',
        link: 'https://www.comptia.org/certifications/security',
        completed: false,
        description: 'Industry-recognized cybersecurity certification',
        resources: [
          { name: 'CompTIA Security+ Study Guide', link: 'https://www.comptia.org/training/books/security-sy0-601-study-guide' }
        ]
      }
    ]
  }
];

const CareerRoadmap = () => {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [career, setCareer] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Load user progress from local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem('careerProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to local storage when it changes
  useEffect(() => {
    if (Object.keys(userProgress).length > 0) {
      localStorage.setItem('careerProgress', JSON.stringify(userProgress));
    }
  }, [userProgress]);

  // Handle career selection
  const handleCareerSelect = (careerPath) => {
    setLoading(true);
    setSelectedCareer(careerPath);
    
    // Simulate API call delay
    setTimeout(() => {
      const selected = careerPaths.find(path => path.id === careerPath);
      setCareer(selected);
      
      // Initialize progress for this career if not exists
      if (!userProgress[careerPath]) {
        setUserProgress(prev => ({
          ...prev,
          [careerPath]: {
            completedSteps: {},
            points: 0
          }
        }));
      }
      
      setLoading(false);
    }, 1000);
  };

  // Handle task completion
  const toggleTaskCompletion = (stepId) => {
    const currentProgress = userProgress[selectedCareer] || { completedSteps: {}, points: 0 };
    const isCompleted = currentProgress.completedSteps[stepId];
    
    // Toggle completion state
    const updatedProgress = {
      ...currentProgress,
      completedSteps: {
        ...currentProgress.completedSteps,
        [stepId]: !isCompleted
      },
      points: isCompleted 
        ? currentProgress.points - 10 
        : currentProgress.points + 10
    };
    
    setUserProgress(prev => ({
      ...prev,
      [selectedCareer]: updatedProgress
    }));
    
    // Show notification
    toast({
      title: isCompleted ? 'Task Unmarked' : 'Task Completed',
      description: isCompleted ? 'Task removed from your completed list' : 'Great job! Keep going on your career path!',
      status: isCompleted ? 'info' : 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!career || !userProgress[selectedCareer]) return 0;
    
    const totalSteps = career.steps.length;
    const completedSteps = Object.values(userProgress[selectedCareer].completedSteps).filter(Boolean).length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  return (
    <Box className="career-roadmap-container">
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="blue.600">
        Career Roadmap Generator
      </Heading>
      
      <Text textAlign="center" fontSize="lg" mb={8} maxW="800px" mx="auto">
        Select your dream role and we'll generate a personalized learning roadmap to help you get there.
      </Text>
      
      {/* Career Selection */}
      <Box className="career-select-container" mb={8}>
        <Text mb={2} fontWeight="bold" fontSize="lg">Choose your goal role:</Text>
        <Select 
          placeholder="Select career path"
          value={selectedCareer}
          onChange={(e) => handleCareerSelect(e.target.value)}
          size="lg"
          bg="white"
        >
          {careerPaths.map(path => (
            <option key={path.id} value={path.id}>
              {path.title}
            </option>
          ))}
        </Select>
      </Box>
      
      {/* Loading state */}
      {loading && (
        <VStack spacing={4} my={8}>
          <Skeleton height="40px" width="100%" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="200px" width="100%" />
          <Skeleton height="200px" width="100%" />
        </VStack>
      )}
      
      {/* Career Roadmap Display */}
      {!loading && career && (
        <Box>
          {/* Career details header */}
          <Flex 
            mb={6} 
            p={6} 
            borderRadius="lg" 
            bg="white" 
            boxShadow="md" 
            align="center" 
            justifyContent="space-between"
            direction={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <HStack spacing={4} align="center">
              <Box
                bg={career.color}
                p={3}
                borderRadius="full"
                color="white"
              >
                <career.icon size={30} />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="lg">{career.title}</Heading>
                <Text color="gray.600">{career.description}</Text>
              </VStack>
            </HStack>
            
            <VStack align={{ base: 'center', md: 'end' }} spacing={1}>
              <Text>Your Progress</Text>
              <HStack w="full" maxW="300px" align="center">
                <Progress 
                  value={calculateProgress()} 
                  size="lg" 
                  colorScheme="green" 
                  w="full" 
                  borderRadius="md"
                />
                <Text fontWeight="bold">{calculateProgress()}%</Text>
              </HStack>
              <HStack>
                <FaTrophy color="gold" />
                <Text fontWeight="bold">
                  {userProgress[selectedCareer]?.points || 0} Points
                </Text>
              </HStack>
            </VStack>
          </Flex>
          
          {/* Key skills required */}
          <Box mb={8}>
            <Heading size="md" mb={3}>Key Skills Required</Heading>
            <Flex wrap="wrap" gap={2}>
              {career.requiredSkills.map((skill, index) => (
                <Tag 
                  key={index} 
                  size="lg" 
                  colorScheme="blue" 
                  borderRadius="full" 
                  px={4} 
                  py={2}
                >
                  {skill}
                </Tag>
              ))}
            </Flex>
          </Box>
          
          {/* Roadmap steps */}
          <Heading size="md" mb={4}>Your Personalized Learning Path</Heading>
          <VStack spacing={4} align="stretch">
            {career.steps.map((step, index) => {
              const isCompleted = userProgress[selectedCareer]?.completedSteps[step.id] || false;
              
              return (
                <Card 
                  key={step.id} 
                  borderLeft="4px solid" 
                  borderLeftColor={step.type === 'course' ? 'blue.400' : 
                                  step.type === 'project' ? 'green.400' : 'purple.400'}
                  boxShadow="md"
                  bg={isCompleted ? 'green.50' : 'white'}
                  opacity={isCompleted ? 0.8 : 1}
                  transition="all 0.3s ease"
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="center">
                      <HStack>
                        <Badge colorScheme={
                          step.type === 'course' ? 'blue' : 
                          step.type === 'project' ? 'green' : 
                          'purple'
                        }>
                          {step.type.toUpperCase()}
                        </Badge>
                        <Text fontWeight="bold" fontSize="lg">
                          Step {index + 1}: {step.title}
                        </Text>
                      </HStack>
                      <IconButton
                        icon={isCompleted ? <FaCheck /> : <FaCheck opacity={0.3} />}
                        colorScheme={isCompleted ? 'green' : 'gray'}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTaskCompletion(step.id)}
                        aria-label="Mark as completed"
                      />
                    </Flex>
                  </CardHeader>
                  
                  <CardBody pt={0}>
                    <Text mb={3}>{step.description}</Text>
                    
                    <Accordion allowToggle mt={3}>
                      <AccordionItem border="none">
                        <AccordionButton p={2} _hover={{ bg: 'gray.100' }}>
                          <Text fontSize="sm" fontWeight="medium">Resources</Text>
                          <AccordionIcon ml="auto" />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack align="stretch" spacing={2}>
                            {step.resources.map((resource, idx) => (
                              <Link 
                                key={idx} 
                                href={resource.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                color="blue.600"
                                fontSize="sm"
                              >
                                {resource.name}
                              </Link>
                            ))}
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </CardBody>
                  
                  <CardFooter pt={0}>
                    <Button 
                      as="a" 
                      href={step.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      size="sm" 
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<FaRocket />}
                    >
                      Start Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </VStack>
          
          {/* Leaderboard section */}
          {calculateProgress() > 0 && (
            <Box mt={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
              <Heading size="md" mb={4}>Your Achievements</Heading>
              <Flex 
                justify="space-around" 
                align="center" 
                wrap="wrap" 
                gap={6}
              >
                <VStack>
                  <Box bg="yellow.100" p={4} borderRadius="full">
                    <FaTrophy size={30} color="#D69E2E" />
                  </Box>
                  <Text fontWeight="bold">{userProgress[selectedCareer]?.points || 0} Points</Text>
                  <Text fontSize="sm">Total Score</Text>
                </VStack>
                
                <Divider orientation="vertical" height="100px" />
                
                <VStack>
                  <Box bg="green.100" p={4} borderRadius="full">
                    <FaCheck size={30} color="#38A169" />
                  </Box>
                  <Text fontWeight="bold">
                    {Object.values(userProgress[selectedCareer]?.completedSteps || {}).filter(Boolean).length} / {career.steps.length}
                  </Text>
                  <Text fontSize="sm">Steps Completed</Text>
                </VStack>
                
                <Divider orientation="vertical" height="100px" />
                
                <VStack>
                  <Box bg="blue.100" p={4} borderRadius="full">
                    <FaStar size={30} color="#3182CE" />
                  </Box>
                  <Text fontWeight="bold">{calculateProgress()}%</Text>
                  <Text fontSize="sm">Path Completion</Text>
                </VStack>
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CareerRoadmap; 