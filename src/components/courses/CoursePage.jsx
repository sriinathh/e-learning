import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Heading, Grid, GridItem, Image, Text, Button, 
  Flex, Tabs, TabList, TabPanels, Tab, TabPanel, List, ListItem, 
  ListIcon, Progress, Card, CardBody, Stack, Accordion, 
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, 
  ModalBody, ModalCloseButton, useDisclosure, Input, Radio, RadioGroup
} from '@chakra-ui/react';
import { 
  FaPlay, FaCheck, FaDownload, FaBookmark, FaFileAlt, 
  FaQuestionCircle, FaCertificate, FaVideo 
} from 'react-icons/fa';

const courses = [
  {
    id: 'web-dev',
    title: 'Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    description: 'Master HTML, CSS, JavaScript, React and Node.js in this comprehensive course.',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721295.png',
    level: 'Beginner to Advanced',
    rating: 4.8,
    students: 768450,
    sections: [
      {
        title: 'Introduction to Web Development',
        lectures: [
          {id: '1-1', title: 'Welcome to the Course', type: 'video', duration: '5:20', videoUrl: 'https://www.youtube.com/embed/zJSY8tbf_ys'},
          {id: '1-2', title: 'How the Web Works', type: 'video', duration: '10:15', videoUrl: 'https://www.youtube.com/embed/hJHvdBlSxug'},
          {id: '1-3', title: 'Course Resources', type: 'resource', duration: '2:30', resourceUrl: '#'}
        ]
      },
      {
        title: 'HTML Fundamentals',
        lectures: [
          {id: '2-1', title: 'HTML Basics', type: 'video', duration: '15:45', videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE'},
          {id: '2-2', title: 'HTML Elements', type: 'video', duration: '12:30', videoUrl: 'https://www.youtube.com/embed/O5uT6p6VWjY'},
          {id: '2-3', title: 'HTML Quiz', type: 'quiz', duration: '10:00', quiz: {
            questions: [
              {
                question: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Hyperlink Text Management Language'],
                answer: 'Hyper Text Markup Language'
              },
              {
                question: 'Which tag is used for creating a hyperlink?',
                options: ['<link>', '<a>', '<href>', '<url>'],
                answer: '<a>'
              },
              {
                question: 'Which element is used to create a line break?',
                options: ['<break>', '<lb>', '<br>', '<newline>'],
                answer: '<br>'
              }
            ]
          }}
        ]
      }
    ]
  },
  {
    id: 'react-masterclass',
    title: 'React Masterclass',
    instructor: 'Maximilian Schwarzmüller',
    description: 'Learn React.js from scratch and build powerful, interactive web applications.',
    image: 'https://cdn-icons-png.flaticon.com/512/1260/1260667.png',
    level: 'Intermediate',
    rating: 4.7,
    students: 459320
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    instructor: 'Jose Portilla',
    description: 'Master Python for data analysis, visualization, and machine learning.',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721286.png',
    level: 'Intermediate to Advanced',
    rating: 4.9,
    students: 352180
  }
];

const CoursePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState({});
  const [showCourseList, setShowCourseList] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
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
  
  const handleEnroll = (course) => {
    if (!enrolledCourses.includes(course.id)) {
      setEnrolledCourses([...enrolledCourses, course.id]);
    }
    setActiveCourse(course);
    setShowCourseList(false);
    
    // Set first lecture as active
    if (course.sections && course.sections.length > 0 && 
        course.sections[0].lectures && course.sections[0].lectures.length > 0) {
      setActiveLecture(course.sections[0].lectures[0]);
    }
  };
  
  const handleSelectLecture = (lecture) => {
    setActiveLecture(lecture);
    setQuizSubmitted(false);
    setQuizAnswers({});
  };
  
  const markLectureComplete = (lectureId) => {
    setCompletedLectures({
      ...completedLectures,
      [lectureId]: true
    });
  };
  
  const calculateProgress = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.sections) return 0;
    
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
  
  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer
    });
  };
  
  const submitQuiz = () => {
    const quiz = activeLecture.quiz;
    let correctCount = 0;
    
    quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.answer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score >= 70) {
      markLectureComplete(activeLecture.id);
    }
  };
  
  const handleVideoEnded = () => {
    if (activeLecture && activeLecture.type === 'video') {
      markLectureComplete(activeLecture.id);
    }
  };
  
  const handleResourceDownload = (lectureId) => {
    markLectureComplete(lectureId);
  };
  
  const handleBackToCourses = () => {
    setShowCourseList(true);
    setActiveCourse(null);
    setActiveLecture(null);
  };
  
  const openLecture = (lecture) => {
    setActiveLecture(lecture);
    
    if (lecture.type === 'quiz') {
      onQuizOpen();
    }
  };
  
  const renderLectureContent = () => {
    if (!activeLecture) return null;
    
    switch (activeLecture.type) {
      case 'video':
        return (
          <Box width="100%" height="0" paddingBottom="56.25%" position="relative">
            <iframe
              src={activeLecture.videoUrl}
              title={activeLecture.title}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onEnded={handleVideoEnded}
            />
          </Box>
        );
      case 'resource':
        return (
          <Flex direction="column" align="center" justify="center" p={10}>
            <FaFileAlt size={50} color="#4299E1" />
            <Heading size="md" mt={4} mb={2}>{activeLecture.title}</Heading>
            <Text mb={6}>Download this resource to enhance your learning</Text>
            <Button 
              leftIcon={<FaDownload />} 
              colorScheme="blue"
              onClick={() => handleResourceDownload(activeLecture.id)}
            >
              Download Resource
            </Button>
          </Flex>
        );
      default:
        return null;
    }
  };
  
  return (
    <Container maxW="container.xl" py={5}>
      {showCourseList ? (
        <Box>
          <Heading as="h1" size="xl" mb={6}>My Courses</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
            {courses.map((course) => (
              <Card key={course.id} variant="outline" boxShadow="md" borderRadius="lg">
                <CardBody>
                  <Flex justify="center" mb={4}>
                    <Image 
                      src={course.image} 
                      alt={course.title}
                      boxSize="120px"
                      objectFit="contain"
                    />
                  </Flex>
                  <Stack>
                    <Heading size="md">{course.title}</Heading>
                    <Text color="gray.500">Instructor: {course.instructor}</Text>
                    <Text mb={2}>{course.description}</Text>
                    <Flex align="center" mb={2}>
                      <Text fontWeight="bold" mr={2}>{course.rating} ★</Text>
                      <Text color="gray.500">({course.students ? course.students.toLocaleString() : '0'} students)</Text>
                    </Flex>
                    <Button 
                      colorScheme="blue" 
                      onClick={() => handleEnroll(course)}
                      isDisabled={enrolledCourses.includes(course.id)}
                    >
                      {enrolledCourses.includes(course.id) ? 'Continue Learning' : 'Enroll Now'}
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>
      ) : (
        activeCourse && (
          <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
            <GridItem>
              <Button mb={4} onClick={handleBackToCourses} colorScheme="gray" size="sm">
                ← Back to Courses
              </Button>
              <Heading as="h1" size="lg" mb={1}>{activeCourse.title}</Heading>
              <Text color="gray.500" mb={4}>Instructor: {activeCourse.instructor}</Text>
              
              {/* Video/Content Container */}
              <Box 
                bg="gray.100" 
                borderRadius="md" 
                overflow="hidden"
                mb={6}
              >
                {renderLectureContent()}
              </Box>
              
              {/* Tabs for Course Content */}
              <Tabs colorScheme="blue" mt={4}>
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Notes</Tab>
                  <Tab>Resources</Tab>
                  {calculateProgress(activeCourse.id) === 100 && <Tab>Certificate</Tab>}
                </TabList>
                
                <TabPanels>
                  <TabPanel>
                    <Heading size="md" mb={2}>About this course</Heading>
                    <Text mb={4}>{activeCourse.description}</Text>
                    
                    <Heading size="md" mb={2}>What you'll learn</Heading>
                    <List spacing={2} mb={4}>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Build websites with HTML, CSS and JavaScript
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Use modern frameworks like React and Node.js
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Implement responsive design principles
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Create full-stack web applications
                      </ListItem>
                    </List>
                  </TabPanel>
                  
                  <TabPanel>
                    <Heading size="md" mb={4}>My Notes</Heading>
                    <Box
                      as="textarea"
                      placeholder="Take notes on this lecture..."
                      p={4}
                      width="100%"
                      height="200px"
                      borderRadius="md"
                      borderColor="gray.300"
                      resize="vertical"
                    />
                    <Button leftIcon={<FaBookmark />} colorScheme="blue" mt={4}>
                      Save Notes
                    </Button>
                  </TabPanel>
                  
                  <TabPanel>
                    <Heading size="md" mb={4}>Course Resources</Heading>
                    <List spacing={3}>
                      <ListItem>
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <FaFileAlt color="#4299E1" />
                            <Text ml={2}>Course Guide PDF</Text>
                          </Flex>
                          <Button 
                            leftIcon={<FaDownload />} 
                            colorScheme="blue" 
                            size="sm" 
                            variant="outline"
                          >
                            Download
                          </Button>
                        </Flex>
                      </ListItem>
                      <ListItem>
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <FaFileAlt color="#4299E1" />
                            <Text ml={2}>Project Starter Files</Text>
                          </Flex>
                          <Button 
                            leftIcon={<FaDownload />} 
                            colorScheme="blue" 
                            size="sm" 
                            variant="outline"
                          >
                            Download
                          </Button>
                        </Flex>
                      </ListItem>
                      <ListItem>
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <FaFileAlt color="#4299E1" />
                            <Text ml={2}>Cheatsheet</Text>
                          </Flex>
                          <Button 
                            leftIcon={<FaDownload />} 
                            colorScheme="blue" 
                            size="sm" 
                            variant="outline"
                          >
                            Download
                          </Button>
                        </Flex>
                      </ListItem>
                    </List>
                  </TabPanel>
                  
                  {calculateProgress(activeCourse.id) === 100 && (
                    <TabPanel>
                      <Flex direction="column" align="center" justify="center" py={6}>
                        <FaCertificate size={60} color="green" />
                        <Heading size="lg" mt={4} mb={2}>Congratulations!</Heading>
                        <Text mb={4} textAlign="center">
                          You have completed all the required lectures in this course.<br />
                          You can now generate your certificate of completion.
                        </Text>
                        <Box width="100%" maxW="400px" mb={6}>
                          <Input 
                            placeholder="Enter your full name for the certificate"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            mb={4}
                          />
                          <Button 
                            colorScheme="green" 
                            leftIcon={<FaCertificate />} 
                            width="100%"
                            onClick={onCertificateOpen}
                            isDisabled={!studentName.trim()}
                          >
                            Generate Certificate
                          </Button>
                        </Box>
                      </Flex>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </GridItem>
            
            {/* Sidebar */}
            <GridItem>
              <Box bg="white" p={4} borderRadius="md" borderWidth="1px">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Course Content</Heading>
                  <Text>{calculateProgress(activeCourse.id)}% complete</Text>
                </Flex>
                <Progress 
                  value={calculateProgress(activeCourse.id)} 
                  size="sm" 
                  colorScheme="green" 
                  borderRadius="full" 
                  mb={4}
                />
                
                <Accordion allowMultiple defaultIndex={[0]}>
                  {activeCourse.sections?.map((section, sectionIndex) => (
                    <AccordionItem key={sectionIndex}>
                      <AccordionButton py={3}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          {section.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} px={2}>
                        <List spacing={1}>
                          {section.lectures.map((lecture) => (
                            <ListItem
                              key={lecture.id}
                              onClick={() => openLecture(lecture)}
                              bg={activeLecture?.id === lecture.id ? "blue.50" : "transparent"}
                              p={2}
                              borderRadius="md"
                              cursor="pointer"
                              _hover={{ bg: "gray.100" }}
                            >
                              <Flex align="center">
                                {completedLectures[lecture.id] ? (
                                  <Box color="green.500" mr={2}><FaCheck /></Box>
                                ) : (
                                  <Box color="gray.400" mr={2}>
                                    {lecture.type === 'video' && <FaPlay />}
                                    {lecture.type === 'quiz' && <FaQuestionCircle />}
                                    {lecture.type === 'resource' && <FaFileAlt />}
                                  </Box>
                                )}
                                <Box flex="1">
                                  <Text fontSize="sm" fontWeight={activeLecture?.id === lecture.id ? "bold" : "normal"}>
                                    {lecture.title}
                                  </Text>
                                  <Flex fontSize="xs" color="gray.500">
                                    <Text mr={2}>
                                      {lecture.type === 'video' && <FaVideo style={{display: 'inline', marginRight: '4px'}} />}
                                      {lecture.type === 'quiz' && <FaQuestionCircle style={{display: 'inline', marginRight: '4px'}} />}
                                      {lecture.type === 'resource' && <FaFileAlt style={{display: 'inline', marginRight: '4px'}} />}
                                      {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
                                    </Text>
                                    {lecture.duration && <Text>{lecture.duration}</Text>}
                                  </Flex>
                                </Box>
                              </Flex>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>
            </GridItem>
          </Grid>
        )
      )}
      
      {/* Quiz Modal */}
      <Modal isOpen={isQuizOpen} onClose={onQuizClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quiz: {activeLecture?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activeLecture?.quiz && !quizSubmitted ? (
              <>
                {activeLecture.quiz.questions.map((question, qIndex) => (
                  <Box key={qIndex} mb={6}>
                    <Text fontWeight="bold" mb={3}>
                      {qIndex + 1}. {question.question}
                    </Text>
                    <RadioGroup 
                      onChange={(val) => handleQuizAnswer(qIndex, val)} 
                      value={quizAnswers[qIndex] || ""}
                    >
                      <Stack>
                        {question.options.map((option, oIndex) => (
                          <Radio key={oIndex} value={option}>
                            {option}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  </Box>
                ))}
              </>
            ) : (
              quizSubmitted && (
                <Box textAlign="center" py={4}>
                  <Heading size="lg" mb={4}>{quizScore}%</Heading>
                  <Text mb={4}>
                    {quizScore >= 70 
                      ? "Congratulations! You've passed the quiz." 
                      : "You didn't pass the quiz. Please try again."}
                  </Text>
                  <Progress 
                    value={quizScore} 
                    colorScheme={quizScore >= 70 ? "green" : "red"} 
                    mb={6}
                  />
                </Box>
              )
            )}
          </ModalBody>
          <ModalFooter>
            {!quizSubmitted ? (
              <Button 
                colorScheme="blue" 
                onClick={submitQuiz}
                isDisabled={Object.keys(quizAnswers).length < activeLecture?.quiz?.questions.length}
              >
                Submit Answers
              </Button>
            ) : (
              <Button 
                colorScheme={quizScore >= 70 ? "green" : "blue"}
                onClick={onQuizClose}
              >
                {quizScore >= 70 ? "Continue" : "Try Again"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Certificate Modal */}
      <Modal isOpen={isCertificateOpen} onClose={onCertificateClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Certificate of Completion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box 
              p={10} 
              border="1px solid" 
              borderColor="gray.200" 
              borderRadius="md"
              backgroundImage="linear-gradient(to bottom right, #f7fafc, #e6fffa)"
              position="relative"
              overflow="hidden"
            >
              {/* Certificate Badge */}
              <Box 
                position="absolute" 
                top="10px" 
                right="10px"
                width="100px"
                height="100px"
                borderRadius="full"
                bg="blue.500"
                opacity="0.1"
              />
              
              <Flex direction="column" align="center" textAlign="center">
                <Heading size="lg" color="blue.600" mb={2}>CampusConnect</Heading>
                <Heading size="md" color="gray.500" fontWeight="normal" mb={6}>Certificate of Achievement</Heading>
                
                <Text fontSize="lg" mb={2}>This certifies that</Text>
                <Heading size="xl" mb={6} fontFamily="cursive">{studentName}</Heading>
                
                <Text fontSize="lg" mb={6}>
                  has successfully completed the course<br />
                  <Text as="span" fontWeight="bold" fontSize="xl">{activeCourse?.title}</Text><br />
                  on {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                </Text>
                
                <Flex justify="space-around" width="100%" mt={10}>
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" borderColor="gray.400" width="180px" mb={2} />
                    <Text>{activeCourse?.instructor}</Text>
                    <Text fontSize="sm" color="gray.500">Instructor</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" borderColor="gray.400" width="180px" mb={2} />
                    <Text>John Davis</Text>
                    <Text fontSize="sm" color="gray.500">Program Director</Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaDownload />} colorScheme="blue" mr={3}>
              Download Certificate
            </Button>
            <Button variant="ghost" onClick={onCertificateClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CoursePage; 