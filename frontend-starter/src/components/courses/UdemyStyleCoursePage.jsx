import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  Badge,
  Progress,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
  IconButton,
  Divider,
  useToast,
  Tooltip,
  Link,
  Avatar,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaPlay,
  FaCheck,
  FaDownload,
  FaLock,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaBookmark,
  FaRegBookmark,
  FaFileAlt,
  FaVideo,
  FaQuestionCircle,
  FaCertificate,
  FaEllipsisV,
  FaChevronRight,
  FaExpand,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaCog,
  FaUserGraduate,
  FaMedal,
  FaSave,
} from "react-icons/fa";
import Certificate from "./Certificate";
import "./UdemyStyleCoursePage.css";

// Mock course data - replace with real API data in production
const courseData = [
  {
    id: "web-dev",
    title: "The Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    instructorTitle: "Developer and Lead Instructor",
    instructorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    logo: "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
    coverImage: "https://img-c.udemycdn.com/course/750x422/1565838_e54e_16.jpg",
    rating: 4.8,
    reviews: 145853,
    students: 715390,
    duration: "41 hours",
    lastUpdated: "December 2023",
    category: "Web Development",
    level: "All Levels",
    description: "Become a full-stack web developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps",
    price: "$84.99",
    discount: "$12.99",
    sections: [
      {
        title: "Introduction to Web Development",
        lectures: [
          { 
            id: "1-1",
            title: "Course Overview",
            duration: "5:42",
            type: "video",
            completed: true,
            videoUrl: "https://www.youtube.com/embed/yTCDVfMz15M"
          },
          { 
            id: "1-2",
            title: "How the Internet Works",
            duration: "8:25",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
          },
          { 
            id: "1-3",
            title: "Resources and Downloads",
            duration: "2:15",
            type: "resource",
            completed: false,
            url: "http://example.com/resources/webdev-resources.pdf"
          },
        ]
      },
      {
        title: "HTML 5",
        lectures: [
          { 
            id: "2-1",
            title: "HTML Basics",
            duration: "12:35",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE"
          },
          { 
            id: "2-2",
            title: "HTML Elements and Tags",
            duration: "15:40",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/teZCB1QeQG0"
          },
          { 
            id: "2-3",
            title: "HTML Quiz",
            type: "quiz",
            completed: false,
            quiz: {
              questions: [
                {
                  question: "What does HTML stand for?",
                  options: [
                    "Hyper Text Markup Language",
                    "Hyper Transfer Markup Language",
                    "Hyperlinks and Text Markup Language",
                    "Home Tool Markup Language"
                  ],
                  correctAnswer: "Hyper Text Markup Language"
                },
                {
                  question: "Which HTML tag is used to define an internal style sheet?",
                  options: ["<script>", "<css>", "<style>", "<link>"],
                  correctAnswer: "<style>"
                },
                {
                  question: "Which HTML attribute is used to define inline styles?",
                  options: ["class", "styles", "style", "font"],
                  correctAnswer: "style"
                }
              ]
            }
          }
        ]
      },
      {
        title: "CSS Fundamentals",
        lectures: [
          { 
            id: "3-1",
            title: "Introduction to CSS",
            duration: "10:15",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI"
          },
          { 
            id: "3-2",
            title: "CSS Selectors",
            duration: "14:30",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/qj20o5UQ3qI"
          }
        ]
      },
      {
        title: "JavaScript Basics",
        lectures: [
          { 
            id: "4-1",
            title: "JavaScript Fundamentals",
            duration: "18:42",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk"
          },
          { 
            id: "4-2",
            title: "Variables and Data Types",
            duration: "15:20",
            type: "video",
            completed: false,
            videoUrl: "https://www.youtube.com/embed/edlFjlzxkSI"
          }
        ]
      }
    ]
  },
  {
    id: "react-masterclass",
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    instructor: "Maximilian Schwarzmüller",
    instructorTitle: "Professional Web Developer and Instructor",
    instructorImage: "https://randomuser.me/api/portraits/men/33.jpg",
    logo: "https://cdn-icons-png.flaticon.com/512/1260/1260667.png",
    coverImage: "https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg",
    rating: 4.7,
    reviews: 158742,
    students: 689540,
    duration: "49 hours",
    lastUpdated: "January 2024",
    category: "Web Development",
    level: "All Levels",
    description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
    price: "$94.99",
    discount: "$13.99",
    sections: [
      {
        title: "Getting Started",
        lectures: [
          { 
            id: "1-1",
            title: "Introduction",
            duration: "6:15",
            type: "video",
            completed: true,
            videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM"
          }
        ]
      }
    ]
  }
];

const UdemyStyleCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Find current course based on URL parameter
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const videoRef = useRef(null);
  
  const {
    isOpen: isNoteOpen,
    onOpen: onNoteOpen,
    onClose: onNoteClose
  } = useDisclosure();
  
  const {
    isOpen: isQuizOpen,
    onOpen: onQuizOpen,
    onClose: onQuizClose
  } = useDisclosure();
  
  const {
    isOpen: isCertificateOpen,
    onOpen: onCertificateOpen,
    onClose: onCertificateClose
  } = useDisclosure();
  
  const {
    isOpen: isCertificateFormOpen,
    onOpen: onCertificateFormOpen,
    onClose: onCertificateFormClose
  } = useDisclosure();
  
  // Get course data on component mount
  useEffect(() => {
    const selectedCourse = courseData.find(c => c.id === courseId);
    if (selectedCourse) {
      setCourse(selectedCourse);
      // Set the first lecture as active by default
      if (selectedCourse.sections && selectedCourse.sections.length > 0 && 
          selectedCourse.sections[0].lectures && selectedCourse.sections[0].lectures.length > 0) {
        setActiveLecture(selectedCourse.sections[0].lectures[0]);
      }
    } else {
      // Course not found
      toast({
        title: "Course not found",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      navigate("/courses");
    }
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course-progress-${courseId}`);
    if (savedProgress) {
      setCompletedLectures(JSON.parse(savedProgress));
    }
  }, [courseId, navigate, toast]);
  
  // Handle lecture selection
  const handleSelectLecture = (lecture) => {
    setActiveLecture(lecture);
    setIsPlaying(true);
    setShowQuizResults(false);
  };
  
  // Mark lecture as completed
  const markLectureCompleted = (lectureId) => {
    const updatedCompletedLectures = {
      ...completedLectures,
      [lectureId]: true
    };
    setCompletedLectures(updatedCompletedLectures);
    
    // Save progress to localStorage
    localStorage.setItem(
      `course-progress-${courseId}`,
      JSON.stringify(updatedCompletedLectures)
    );
  };
  
  // Calculate course progress percentage
  const calculateProgress = () => {
    if (!course) return 0;
    
    let totalLectures = 0;
    let completedCount = 0;
    
    course.sections.forEach(section => {
      totalLectures += section.lectures.length;
      section.lectures.forEach(lecture => {
        if (completedLectures[lecture.id]) {
          completedCount++;
        }
      });
    });
    
    return totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;
  };
  
  // Handle quiz answer selection
  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer
    });
  };
  
  // Handle quiz submission
  const handleSubmitQuiz = () => {
    const quiz = activeLecture.quiz;
    let correctAnswers = 0;
    
    // Calculate score
    quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    setQuizScore(score);
    setShowQuizResults(true);
    
    // Mark as completed if score is passing (>= 70%)
    if (score >= 70) {
      markLectureCompleted(activeLecture.id);
    }
  };
  
  // Handle video ended event
  const handleVideoEnded = () => {
    if (activeLecture && activeLecture.type === 'video') {
      markLectureCompleted(activeLecture.id);
      
      // Automatically go to next lecture if available
      const allLectures = course.sections.flatMap(section => section.lectures);
      const currentIndex = allLectures.findIndex(lecture => lecture.id === activeLecture.id);
      
      if (currentIndex < allLectures.length - 1) {
        setActiveLecture(allLectures[currentIndex + 1]);
      }
    }
  };
  
  // Handle certificate generation
  const handleGenerateCertificate = () => {
    if (certificateName.trim() === '') {
      toast({
        title: "Name is required",
        status: "error",
        duration: 2000,
        isClosable: true
      });
      return;
    }
    
    onCertificateFormClose();
    onCertificateOpen();
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Render video player
  const renderVideoPlayer = () => {
    if (!activeLecture) return null;
    
    if (activeLecture.type === 'video') {
      return (
        <Box position="relative" width="100%" height="0" paddingBottom="56.25%">
          <Box position="absolute" top="0" left="0" width="100%" height="100%">
            <iframe
              ref={videoRef}
              width="100%"
              height="100%"
              src={`${activeLecture.videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
              title={activeLecture.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onEnded={handleVideoEnded}
            ></iframe>
          </Box>
          
          <Flex 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0" 
            p={4} 
            bg="rgba(0,0,0,0.7)" 
            color="white"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack spacing={4}>
              <IconButton
                icon={isPlaying ? <FaPause /> : <FaPlay />}
                variant="ghost"
                color="white"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause" : "Play"}
              />
              <IconButton
                icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                variant="ghost"
                color="white"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
              />
              <Text fontSize="sm">{activeLecture.duration}</Text>
            </HStack>
            
            <HStack spacing={4}>
              <IconButton
                icon={<FaCog />}
                variant="ghost"
                color="white"
                aria-label="Settings"
              />
              <IconButton
                icon={<FaExpand />}
                variant="ghost"
                color="white"
                onClick={toggleFullscreen}
                aria-label="Fullscreen"
              />
            </HStack>
          </Flex>
        </Box>
      );
    } else if (activeLecture.type === 'quiz') {
      return (
        <Box p={6} bg="white" borderRadius="md" shadow="md">
          <Heading size="md" mb={4}>Quiz: {activeLecture.title}</Heading>
          
          {!showQuizResults ? (
            <VStack align="stretch" spacing={6}>
              {activeLecture.quiz.questions.map((question, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold" mb={3}>
                    {index + 1}. {question.question}
                  </Text>
                  <RadioGroup 
                    onChange={(value) => handleQuizAnswer(index, value)} 
                    value={quizAnswers[index] || ""}
                  >
                    <Stack spacing={2}>
                      {question.options.map((option, optIndex) => (
                        <Radio key={optIndex} value={option}>
                          {option}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              ))}
              
              <Button 
                colorScheme="blue" 
                size="lg" 
                onClick={handleSubmitQuiz}
                isDisabled={Object.keys(quizAnswers).length < activeLecture.quiz.questions.length}
              >
                Submit Quiz
              </Button>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={6}>
              <Box textAlign="center" py={6}>
                <Heading size="xl" mb={2}>{quizScore}%</Heading>
                <Text fontSize="lg" mb={4}>
                  {quizScore >= 70 ? "Congratulations! You passed the quiz." : "You didn't pass. Please try again."}
                </Text>
                <Progress 
                  value={quizScore} 
                  colorScheme={quizScore >= 70 ? "green" : "red"} 
                  height="12px" 
                  borderRadius="full" 
                  mb={4}
                />
                
                {quizScore >= 70 ? (
                  <Button 
                    colorScheme="green" 
                    leftIcon={<FaCheck />}
                    onClick={() => {
                      // Find the next lecture
                      const allLectures = course.sections.flatMap(section => section.lectures);
                      const currentIndex = allLectures.findIndex(lecture => lecture.id === activeLecture.id);
                      
                      if (currentIndex < allLectures.length - 1) {
                        setActiveLecture(allLectures[currentIndex + 1]);
                      }
                    }}
                  >
                    Continue to Next Lecture
                  </Button>
                ) : (
                  <Button 
                    colorScheme="blue" 
                    onClick={() => {
                      setQuizAnswers({});
                      setShowQuizResults(false);
                    }}
                  >
                    Try Again
                  </Button>
                )}
              </Box>
            </VStack>
          )}
        </Box>
      );
    } else if (activeLecture.type === 'resource') {
      return (
        <Box p={6} bg="white" borderRadius="md" shadow="md" textAlign="center">
          <Icon as={FaFileAlt} boxSize={16} color="blue.500" mb={4} />
          <Heading size="md" mb={4}>{activeLecture.title}</Heading>
          <Text mb={6}>Download this resource to enhance your learning experience.</Text>
          <Button 
            as="a" 
            href={activeLecture.url} 
            target="_blank" 
            rel="noopener noreferrer"
            colorScheme="blue" 
            leftIcon={<FaDownload />}
            onClick={() => markLectureCompleted(activeLecture.id)}
          >
            Download Resource
          </Button>
        </Box>
      );
    }
    
    return null;
  };

  return (
    <Box>
      {course && (
        <Flex direction={{ base: "column", lg: "row" }} h="calc(100vh - 64px)">
          {/* Main content area */}
          <Box flex="1" bg="gray.50" overflowY="auto">
            {/* Video/content display */}
            <Box bg="black" width="100%">
              {renderVideoPlayer()}
            </Box>
            
            {/* Course content below video */}
            <Box p={6}>
              <Heading size="lg" mb={2}>{activeLecture?.title || course.title}</Heading>
              
              <HStack spacing={2} my={3}>
                <Badge colorScheme="blue" variant="subtle" px={2} py={1}>{course.category}</Badge>
                <Badge colorScheme="green" variant="subtle" px={2} py={1}>{course.level}</Badge>
                <HStack spacing={1}>
                  <Icon as={FaStar} color="yellow.400" />
                  <Text fontWeight="bold">{course.rating}</Text>
                  <Text color="gray.500">({course.reviews.toLocaleString()} reviews)</Text>
                </HStack>
              </HStack>
              
              <Tabs variant="enclosed" mt={6} colorScheme="blue">
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Notes</Tab>
                  <Tab>Resources</Tab>
                  {calculateProgress() === 100 && <Tab>Certificate</Tab>}
                </TabList>
                
                <TabPanels>
                  <TabPanel>
                    <Box mb={6}>
                      <Heading size="md" mb={3}>About this course</Heading>
                      <Text>{course.description}</Text>
                    </Box>
                    
                    <Flex justify="space-between" align="center" wrap="wrap" mb={6}>
                      <Box flex="1" minW="200px" mr={6} mb={4}>
                        <Heading size="sm" mb={2}>Instructor</Heading>
                        <Flex align="center">
                          <Avatar src={course.instructorImage} name={course.instructor} mr={3} />
                          <Box>
                            <Text fontWeight="bold">{course.instructor}</Text>
                            <Text fontSize="sm" color="gray.600">{course.instructorTitle}</Text>
                          </Box>
                        </Flex>
                      </Box>
                      
                      <Box flex="1" minW="200px" mb={4}>
                        <Heading size="sm" mb={2}>Course details</Heading>
                        <HStack spacing={6}>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.600">Duration</Text>
                            <Text fontWeight="bold">{course.duration}</Text>
                          </VStack>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.600">Last Updated</Text>
                            <Text fontWeight="bold">{course.lastUpdated}</Text>
                          </VStack>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.600">Students</Text>
                            <Text fontWeight="bold">{course.students.toLocaleString()}</Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </Flex>
                  </TabPanel>
                  
                  <TabPanel>
                    <Button
                      leftIcon={<FaBookmark />}
                      colorScheme="blue"
                      onClick={onNoteOpen}
                      mb={4}
                    >
                      Add Note
                    </Button>
                    
                    <Text color="gray.600">Your notes for this lecture will appear here.</Text>
                  </TabPanel>
                  
                  <TabPanel>
                    <Heading size="md" mb={4}>Course Resources</Heading>
                    <VStack align="stretch" spacing={4}>
                      {course.sections.flatMap(section => 
                        section.lectures.filter(lecture => lecture.type === 'resource')
                      ).map(resource => (
                        <Box 
                          key={resource.id} 
                          p={4} 
                          borderWidth="1px" 
                          borderRadius="md"
                          _hover={{ bg: "gray.50" }}
                        >
                          <Flex align="center" justify="space-between">
                            <HStack>
                              <Icon as={FaFileAlt} color="blue.500" />
                              <Text fontWeight="medium">{resource.title}</Text>
                            </HStack>
                            <Button 
                              as="a" 
                              href={resource.url} 
                              target="_blank" 
                              size="sm"
                              colorScheme="blue" 
                              variant="outline"
                              leftIcon={<FaDownload />}
                            >
                              Download
                            </Button>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  </TabPanel>
                  
                  {calculateProgress() === 100 && (
                    <TabPanel>
                      <Box textAlign="center" py={8}>
                        <Icon as={FaCertificate} boxSize={16} color="green.500" mb={4} />
                        <Heading size="lg" mb={3}>Congratulations!</Heading>
                        <Text fontSize="lg" mb={6}>
                          You've completed the course. You can now generate your certificate of completion.
                        </Text>
                        <Button 
                          colorScheme="green" 
                          size="lg"
                          leftIcon={<FaCertificate />}
                          onClick={onCertificateFormOpen}
                        >
                          Generate Certificate
                        </Button>
                      </Box>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
          
          {/* Course sidebar */}
          <Box 
            width={{ base: "100%", lg: "380px" }} 
            bg="white" 
            borderLeftWidth={{ base: 0, lg: "1px" }} 
            overflowY="auto"
          >
            <Box p={4} borderBottomWidth="1px">
              <Heading size="md" mb={4}>Course Content</Heading>
              <Flex align="center" justify="space-between" mb={2}>
                <Text>{course.sections.length} sections • {course.sections.reduce((acc, section) => acc + section.lectures.length, 0)} lectures</Text>
                <HStack>
                  <Text fontWeight="bold">{calculateProgress()}%</Text>
                  <Text>complete</Text>
                </HStack>
              </Flex>
              <Progress value={calculateProgress()} colorScheme="green" size="sm" borderRadius="full" />
            </Box>
            
            <Accordion defaultIndex={[0]} allowMultiple>
              {course.sections.map((section, sectionIndex) => (
                <AccordionItem key={sectionIndex} borderBottomWidth="1px">
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {section.title}
                    </Box>
                    <Text fontSize="sm" color="gray.500" mr={2}>
                      {section.lectures.length} lectures
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={2}>
                    <VStack align="stretch" spacing={0}>
                      {section.lectures.map((lecture, lectureIndex) => (
                        <Flex
                          key={lecture.id}
                          align="center"
                          p={3}
                          cursor="pointer"
                          borderRadius="md"
                          bg={activeLecture?.id === lecture.id ? "blue.50" : "transparent"}
                          _hover={{ bg: activeLecture?.id === lecture.id ? "blue.50" : "gray.50" }}
                          onClick={() => handleSelectLecture(lecture)}
                        >
                          <Box 
                            mr={3}
                            color={completedLectures[lecture.id] ? "green.500" : "gray.400"}
                          >
                            {completedLectures[lecture.id] ? (
                              <Icon as={FaCheck} boxSize={4} />
                            ) : (
                              <Box w={4} h={4} borderWidth="1px" borderRadius="full" />
                            )}
                          </Box>
                          
                          <Box flex="1" mr={3}>
                            <Flex align="center" mb={1}>
                              {lecture.type === 'video' && <Icon as={FaPlay} boxSize={3} mr={2} color="gray.500" />}
                              {lecture.type === 'quiz' && <Icon as={FaQuestionCircle} boxSize={3} mr={2} color="purple.500" />}
                              {lecture.type === 'resource' && <Icon as={FaFileAlt} boxSize={3} mr={2} color="blue.500" />}
                              <Text fontSize="sm" fontWeight={activeLecture?.id === lecture.id ? "bold" : "normal"}>
                                {lecture.title}
                              </Text>
                            </Flex>
                            {lecture.duration && (
                              <Text fontSize="xs" color="gray.500">
                                {lecture.duration}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Flex>
      )}
      
      {/* Note modal */}
      <Modal isOpen={isNoteOpen} onClose={onNoteClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Note for: {activeLecture?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea 
              placeholder="Type your notes here..." 
              size="lg" 
              rows={10}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNoteClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<FaSave />}
              onClick={() => {
                toast({
                  title: "Note saved",
                  status: "success",
                  duration: 2000,
                  isClosable: true
                });
                onNoteClose();
              }}
            >
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Certificate name modal */}
      <Modal isOpen={isCertificateFormOpen} onClose={onCertificateFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Your Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please enter your full name as you would like it to appear on your certificate:</Text>
            <Input 
              placeholder="Full Name" 
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCertificateFormClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleGenerateCertificate}
            >
              Generate Certificate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Certificate display modal */}
      <Modal isOpen={isCertificateOpen} onClose={onCertificateClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Certificate of Completion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Certificate 
              courseData={course}
              studentName={certificateName}
              completionDate={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              leftIcon={<FaDownload />}
              mr={3}
              onClick={() => {
                toast({
                  title: "Certificate downloaded",
                  status: "success",
                  duration: 2000,
                  isClosable: true
                });
              }}
            >
              Download PDF
            </Button>
            <Button variant="ghost" onClick={onCertificateClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UdemyStyleCoursePage; 