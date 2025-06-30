import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Progress,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  Flex,
  IconButton,
  useToast,
  Card,
  CardBody,
  Tooltip,
  Center,
  SimpleGrid
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  DownloadIcon,
  ChevronRightIcon,
  RepeatIcon,
  InfoIcon,
  StarIcon,
  TimeIcon,
  EditIcon,
  ChatIcon,
  QuestionIcon
} from "@chakra-ui/icons";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaCode, FaBook, FaRegFileAlt } from "react-icons/fa";

// Mock data - would be fetched from an API in a real application
const coursesData = {
  1: {
    id: 1,
    title: "Frontend Development Bootcamp",
    description: "Master the fundamentals of HTML, CSS, and JavaScript to build interactive websites and responsive web applications.",
    instructor: "John Doe",
    instructorProfile: "https://randomuser.me/api/portraits/men/32.jpg",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
    modules: [
      {
        id: 1,
        title: "Introduction to HTML",
        duration: "45 min",
        completed: true,
        lessons: [
          { id: 1, title: "HTML Basics", duration: "15 min", completed: true },
          { id: 2, title: "HTML Elements", duration: "15 min", completed: true },
          { id: 3, title: "HTML Forms", duration: "15 min", completed: true }
        ]
      },
      {
        id: 2,
        title: "CSS Fundamentals",
        duration: "60 min",
        completed: false,
        lessons: [
          { id: 1, title: "CSS Selectors", duration: "20 min", completed: true },
          { id: 2, title: "CSS Box Model", duration: "20 min", completed: false },
          { id: 3, title: "CSS Flexbox", duration: "20 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "JavaScript Basics",
        duration: "90 min",
        completed: false,
        lessons: [
          { id: 1, title: "Variables and Data Types", duration: "30 min", completed: false },
          { id: 2, title: "Functions and Scope", duration: "30 min", completed: false },
          { id: 3, title: "DOM Manipulation", duration: "30 min", completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, title: "HTML Cheat Sheet", type: "pdf", url: "/resources/html-cheat-sheet.pdf" },
      { id: 2, title: "CSS Reference Guide", type: "pdf", url: "/resources/css-reference.pdf" },
      { id: 3, title: "JavaScript Fundamentals", type: "pdf", url: "/resources/js-fundamentals.pdf" },
      { id: 4, title: "Web Development Tools", type: "link", url: "https://developer.mozilla.org/en-US/" }
    ],
    assignments: [
      { id: 1, title: "Create a Personal Portfolio", dueDate: "2023-06-15", completed: false },
      { id: 2, title: "Build a Responsive Landing Page", dueDate: "2023-06-30", completed: false }
    ],
    discussions: [
      { id: 1, title: "Best practices for responsive design?", responses: 12 },
      { id: 2, title: "How to debug JavaScript effectively?", responses: 8 },
      { id: 3, title: "Which CSS framework should I learn?", responses: 15 }
    ],
    notes: `
# Frontend Development Notes

## HTML Basics
- HTML stands for HyperText Markup Language
- It is the standard markup language for web pages
- HTML elements are represented by tags

## CSS Fundamentals
- CSS stands for Cascading Style Sheets
- It describes how HTML elements should be displayed
- CSS can control layout of multiple web pages

## JavaScript Essentials
- JavaScript is a programming language for the web
- It can update HTML and CSS
- It enables interactive web pages
    `
  },
  2: {
    id: 2,
    title: "Backend Development Bootcamp",
    description: "Dive into the world of server-side development using Node.js, Express, and databases.",
    instructor: "Jane Smith",
    instructorProfile: "https://randomuser.me/api/portraits/women/44.jpg",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.7,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/2818/2818333.png",
    modules: [
      {
        id: 1,
        title: "Introduction to Node.js",
        duration: "60 min",
        completed: false,
        lessons: [
          { id: 1, title: "Node.js Basics", duration: "20 min", completed: false },
          { id: 2, title: "NPM Packages", duration: "20 min", completed: false },
          { id: 3, title: "Asynchronous Programming", duration: "20 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "Express.js Framework",
        duration: "75 min",
        completed: false,
        lessons: [
          { id: 1, title: "Express Fundamentals", duration: "25 min", completed: false },
          { id: 2, title: "Routing & Middleware", duration: "25 min", completed: false },
          { id: 3, title: "RESTful API Development", duration: "25 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Database Integration",
        duration: "90 min",
        completed: false,
        lessons: [
          { id: 1, title: "MongoDB Basics", duration: "30 min", completed: false },
          { id: 2, title: "Mongoose ODM", duration: "30 min", completed: false },
          { id: 3, title: "CRUD Operations", duration: "30 min", completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, title: "Node.js Documentation", type: "link", url: "https://nodejs.org/en/docs/" },
      { id: 2, title: "Express.js Guide", type: "pdf", url: "/resources/express-guide.pdf" },
      { id: 3, title: "MongoDB Cheat Sheet", type: "pdf", url: "/resources/mongodb-cheat-sheet.pdf" }
    ],
    assignments: [
      { id: 1, title: "Build a RESTful API", dueDate: "2023-07-15", completed: false },
      { id: 2, title: "Create a Database-Driven Web App", dueDate: "2023-07-30", completed: false }
    ],
    discussions: [
      { id: 1, title: "Best practices for API security?", responses: 10 },
      { id: 2, title: "MongoDB vs SQL databases", responses: 14 }
    ],
    notes: `
# Backend Development Notes

## Node.js Basics
- Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine
- It uses an event-driven, non-blocking I/O model
- Perfect for data-intensive real-time applications

## Express.js Framework
- Express is a minimal and flexible Node.js web application framework
- Provides a robust set of features for web and mobile applications
- Used for building RESTful APIs

## Database Integration
- MongoDB is a NoSQL database program
- Uses JSON-like documents with optional schemas
- Mongoose provides a schema-based solution to model application data
    `
  }
};

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const videoRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Fetch course data (simulated)
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          if (coursesData[courseId]) {
            setCourse(coursesData[courseId]);
            // Calculate progress based on completed lessons
            calculateProgress(coursesData[courseId]);
          } else {
            toast({
              title: "Course not found",
              description: "The requested course could not be found.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            navigate('/courses');
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
        toast({
          title: "Error loading course",
          description: "There was an error loading the course content.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCourse();
  }, [courseId, navigate, toast]);

  // Calculate course progress
  const calculateProgress = (courseData) => {
    if (!courseData || !courseData.modules) return 0;
    
    let completedLessons = 0;
    let totalLessons = 0;
    
    courseData.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lesson.completed) completedLessons++;
      });
    });
    
    const calculatedProgress = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;
    
    setProgress(calculatedProgress);
    return calculatedProgress;
  };

  // Video player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen not available",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };

  const saveNotes = () => {
    // In a real app, this would save to a database
    toast({
      title: "Notes saved",
      description: "Your course notes have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const markLessonComplete = (moduleIndex, lessonIndex) => {
    if (!course) return;
    
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons[lessonIndex].completed = true;
    
    // Check if all lessons in the module are completed
    const allLessonsCompleted = updatedCourse.modules[moduleIndex].lessons.every(lesson => lesson.completed);
    if (allLessonsCompleted) {
      updatedCourse.modules[moduleIndex].completed = true;
    }
    
    setCourse(updatedCourse);
    calculateProgress(updatedCourse);
    
    toast({
      title: "Lesson completed",
      description: "Your progress has been updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleTakeQuiz = () => {
    navigate(`/quiz/${courseId}`);
  };

  if (loading) {
    return (
      <Center h="80vh">
        <VStack spacing={4}>
          <Text fontSize="xl">Loading course content...</Text>
          <Progress size="xs" isIndeterminate w="300px" colorScheme="teal" />
        </VStack>
      </Center>
    );
  }

  if (!course) {
    return (
      <Center h="80vh">
        <VStack spacing={4}>
          <Heading size="lg">Course Not Found</Heading>
          <Text>The requested course could not be found.</Text>
          <Button colorScheme="teal" onClick={() => navigate('/courses')}>
            Return to Courses
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6}>
        <Heading size="xl">{course.title}</Heading>
        <Text color="gray.600" mt={2}>{course.description}</Text>
        
        <Flex mt={4} flexWrap="wrap" gap={2}>
          <Badge colorScheme="purple" p={1} borderRadius="md" display="flex" alignItems="center">
            <TimeIcon mr={1} /> {course.duration}
          </Badge>
          <Badge colorScheme="blue" p={1} borderRadius="md">
            Level: {course.level}
          </Badge>
          <Badge colorScheme="yellow" p={1} borderRadius="md" display="flex" alignItems="center">
            <StarIcon mr={1} /> {course.rating} Rating
          </Badge>
          <Badge colorScheme="green" p={1} borderRadius="md" display="flex" alignItems="center">
            <CheckCircleIcon mr={1} /> {progress}% Complete
          </Badge>
        </Flex>
      </Box>

      <Box mb={8}>
        <Box position="relative" w="100%" borderRadius="md" overflow="hidden" boxShadow="lg">
          <video
            ref={videoRef}
            width="100%"
            src={course.videoUrl}
            poster={course.thumbnail}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ borderRadius: "md", backgroundColor: "black" }}
          />
          
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="rgba(0,0,0,0.7)"
            p={3}
            color="white"
            transition="opacity 0.3s"
            opacity="0.9"
            _hover={{ opacity: 1 }}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm">{formatTime(currentTime)} / {formatTime(duration)}</Text>
              <HStack spacing={2}>
                <IconButton 
                  icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />} 
                  aria-label="Toggle mute" 
                  size="sm" 
                  variant="ghost" 
                  colorScheme="whiteAlpha" 
                  onClick={toggleMute} 
                />
                <IconButton 
                  icon={isFullScreen ? <FaCompress /> : <FaExpand />} 
                  aria-label="Toggle fullscreen" 
                  size="sm" 
                  variant="ghost" 
                  colorScheme="whiteAlpha" 
                  onClick={toggleFullScreen} 
                />
              </HStack>
            </Flex>
            
            <Flex align="center" width="100%">
              <IconButton 
                icon={isPlaying ? <FaPause /> : <FaPlay />} 
                aria-label="Play/Pause" 
                size="sm" 
                mr={3} 
                onClick={togglePlay} 
              />
              <Box flex="1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleSeek}
                  style={{ width: '100%' }}
                />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 5 }} spacing={6} mb={8}>
        <Box gridColumn={{ md: "span 3" }}>
          <Tabs isFitted variant="enclosed" colorScheme="teal" size="lg">
            <TabList>
              <Tab fontWeight="bold"><FaBook style={{ marginRight: '8px' }} /> Content</Tab>
              <Tab fontWeight="bold"><FaRegFileAlt style={{ marginRight: '8px' }} /> Resources</Tab>
              <Tab fontWeight="bold"><ChatIcon style={{ marginRight: '8px' }} /> Discussions</Tab>
              <Tab fontWeight="bold"><EditIcon style={{ marginRight: '8px' }} /> Notes</Tab>
            </TabList>

            <TabPanels>
              {/* Course Content Tab */}
              <TabPanel>
                <Box p={2}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md">Course Modules</Heading>
                    <Progress value={progress} size="sm" w="200px" colorScheme="green" borderRadius="full" />
                  </Flex>
                  
                  <Accordion allowToggle defaultIndex={[0]}>
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem key={module.id}>
                        <h2>
                          <AccordionButton 
                            _expanded={{ bg: 'teal.50', color: 'teal.700' }}
                            onClick={() => setActiveModule(moduleIndex)}
                          >
                            <Box flex="1" textAlign="left" fontWeight="bold">
                              {module.completed && <CheckCircleIcon color="green.500" mr={2} />}
                              {module.title}
                            </Box>
                            <Badge mr={2} colorScheme="purple">{module.duration}</Badge>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <List spacing={3}>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <ListItem key={lesson.id}>
                                <Flex justify="space-between" align="center">
                                  <HStack>
                                    {lesson.completed ? (
                                      <ListIcon as={CheckCircleIcon} color="green.500" />
                                    ) : (
                                      <ListIcon as={ChevronRightIcon} color="gray.500" />
                                    )}
                                    <Text
                                      fontWeight={activeLesson === lessonIndex && activeModule === moduleIndex ? "bold" : "normal"}
                                      color={activeLesson === lessonIndex && activeModule === moduleIndex ? "teal.600" : "inherit"}
                                    >
                                      {lesson.title}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Badge colorScheme="blue" mr={2}>{lesson.duration}</Badge>
                                    {!lesson.completed && (
                                      <Button
                                        size="xs"
                                        colorScheme="green"
                                        onClick={() => markLessonComplete(moduleIndex, lessonIndex)}
                                      >
                                        Mark Complete
                                      </Button>
                                    )}
                                  </HStack>
                                </Flex>
                              </ListItem>
                            ))}
                          </List>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              </TabPanel>

              {/* Resources Tab */}
              <TabPanel>
                <Box p={2}>
                  <Heading size="md" mb={4}>Course Resources</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {course.resources.map(resource => (
                      <Card key={resource.id} variant="outline" _hover={{ shadow: 'md' }}>
                        <CardBody>
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Box color="teal.500" mr={2}>
                                {resource.type === 'pdf' ? <FaRegFileAlt size="1.5em" /> : <FaCode size="1.5em" />}
                              </Box>
                              <Text fontWeight="medium">{resource.title}</Text>
                            </HStack>
                            <Tooltip label={resource.type === 'pdf' ? 'Download PDF' : 'Open Link'}>
                              <IconButton
                                icon={resource.type === 'pdf' ? <DownloadIcon /> : <ChevronRightIcon />}
                                aria-label="Download or open resource"
                                colorScheme="teal"
                                variant="ghost"
                                onClick={() => window.open(resource.url, '_blank')}
                              />
                            </Tooltip>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              </TabPanel>

              {/* Discussions Tab */}
              <TabPanel>
                <Box p={2}>
                  <Heading size="md" mb={4}>Course Discussions</Heading>
                  <VStack spacing={4} align="stretch">
                    {course.discussions.map(discussion => (
                      <Card key={discussion.id} variant="outline" _hover={{ shadow: 'md' }}>
                        <CardBody>
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Box color="purple.500" mr={2}>
                                <QuestionIcon boxSize={5} />
                              </Box>
                              <Text fontWeight="medium">{discussion.title}</Text>
                            </HStack>
                            <Badge colorScheme="purple">{discussion.responses} responses</Badge>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                    <Button colorScheme="purple" leftIcon={<ChatIcon />} mt={2}>
                      Start New Discussion
                    </Button>
                  </VStack>
                </Box>
              </TabPanel>

              {/* Notes Tab */}
              <TabPanel>
                <Box p={2}>
                  <Heading size="md" mb={4}>Course Notes</Heading>
                  <VStack spacing={4} align="stretch">
                    <Box
                      as="textarea"
                      value={notes || course.notes}
                      onChange={handleNoteChange}
                      h="300px"
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.300"
                      fontFamily="monospace"
                      resize="vertical"
                    />
                    <Button colorScheme="teal" onClick={saveNotes} alignSelf="flex-end">
                      Save Notes
                    </Button>
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Course Sidebar */}
        <Box gridColumn={{ md: "span 2" }}>
          <Card variant="outline" boxShadow="md">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Course Progress</Heading>
                <Box textAlign="center">
                  <CircularProgress value={progress} size="120px" thickness="8px" color="green.400">
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    >
                      <Text fontWeight="bold" fontSize="xl">{progress}%</Text>
                    </Box>
                  </CircularProgress>
                </Box>
                <Divider />
                <Heading size="md">Assignments</Heading>
                <VStack spacing={3} align="stretch">
                  {course.assignments.map(assignment => (
                    <Box key={assignment.id} p={3} borderWidth="1px" borderRadius="md">
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">{assignment.title}</Text>
                        <Badge colorScheme={assignment.completed ? "green" : "red"}>
                          {assignment.completed ? "Completed" : "Pending"}
                        </Badge>
                      </Flex>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Text>
                    </Box>
                  ))}
                </VStack>
                <Divider />
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleTakeQuiz}
                  leftIcon={<QuestionIcon />}
                  isDisabled={progress < 50}
                >
                  {progress < 50 ? "Complete 50% to Unlock Quiz" : "Take Course Quiz"}
                </Button>
                <Text fontSize="sm" textAlign="center" color="gray.500">
                  {progress < 50 
                    ? "You need to complete at least 50% of the course to access the quiz" 
                    : "Test your knowledge and earn a certificate"}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default CourseContent;
