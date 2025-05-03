import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  Radio, 
  RadioGroup, 
  Progress, 
  Badge, 
  useToast, 
  Container,
  Flex,
  Card,
  CardBody,
  Image,
  Center,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import confetti from 'canvas-confetti';

// Mock data - in a real app this would come from an API
const quizzes = {
  1: {
    title: "Frontend Development Quiz",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals",
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Trainer Marking Language",
          "HyperText Markup Language",
          "HyperText Markdown Language",
          "None of the above",
        ],
        answer: "HyperText Markup Language",
        explanation: "HTML (HyperText Markup Language) is the standard markup language for creating web pages."
      },
      {
        id: 2,
        question: "Which one is a frontend language?",
        options: ["Python", "Java", "HTML", "Node.js"],
        answer: "HTML",
        explanation: "HTML is used to structure content on the web and is a key frontend technology."
      },
      {
        id: 3,
        question: "What is the main purpose of CSS?",
        options: ["Structure", "Functionality", "Styling", "Database"],
        answer: "Styling",
        explanation: "CSS (Cascading Style Sheets) is used to control the appearance and layout of web pages."
      },
      {
        id: 4,
        question: "Which CSS property changes the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        answer: "color",
        explanation: "The 'color' property in CSS is used to set the color of text content."
      },
      {
        id: 5,
        question: "Which of the following is NOT a JavaScript framework?",
        options: ["React", "Angular", "Vue", "HTML5"],
        answer: "HTML5",
        explanation: "HTML5 is a markup language, not a JavaScript framework."
      },
    ]
  },
  2: {
    title: "Backend Development Quiz",
    description: "Test your knowledge of server-side programming and databases",
    questions: [
      {
        id: 1,
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Apple Programming Interface", "Automatic Programming Interface", "None of the above"],
        answer: "Application Programming Interface",
        explanation: "API (Application Programming Interface) allows different software applications to communicate with each other."
      },
      {
        id: 2,
        question: "Which of the following is a NoSQL database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        answer: "MongoDB",
        explanation: "MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents."
      },
      {
        id: 3,
        question: "What is Express.js used for?",
        options: ["Building static pages", "Building server-side applications", "Managing databases", "Frontend styling"],
        answer: "Building server-side applications",
        explanation: "Express.js is a minimal and flexible Node.js web application framework for building server-side applications."
      },
      {
        id: 4,
        question: "Which HTTP method is typically used for creating a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: "POST",
        explanation: "POST is typically used to send data to create a new resource on the server."
      },
      {
        id: 5,
        question: "What is middleware in Express.js?",
        options: [
          "A function with access to request and response objects",
          "A database connector",
          "A frontend component",
          "A type of database"
        ],
        answer: "A function with access to request and response objects",
        explanation: "Middleware functions have access to the request and response objects and can perform operations on them."
      }
    ]
  }
};

// More course quizzes can be added to the quizzes object

const QuizPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [quizStarted, setQuizStarted] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Initialize the quiz
  useEffect(() => {
    if (quizzes[id]) {
      setCurrentQuiz(quizzes[id]);
      // Initialize answers array
      setAnswers(new Array(quizzes[id].questions.length).fill(null));
    } else {
      // Handle case where quiz doesn't exist
      toast({
        title: "Quiz not found",
        description: "The requested quiz could not be found.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/courses');
    }
  }, [id, navigate, toast]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !currentQuiz || showResults || !timeLeft || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 60; // Reset timer for next question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, currentQuestionIndex, showResults, isAnswerSubmitted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(60);
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(value);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before submitting",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setTimeLeft(60);
      setIsAnswerSubmitted(false);
    } else {
      // All questions answered, show results
      setShowResults(true);
      // Trigger confetti if score is good
      const correctAnswers = calculateScore().correctCount;
      if (correctAnswers / currentQuiz.questions.length >= 0.7) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, correctCount: 0, totalQuestions: 0 };

    const correctAnswers = answers.filter((answer, index) => 
      answer === currentQuiz.questions[index].answer
    ).length;

    return {
      score: Math.round((correctAnswers / currentQuiz.questions.length) * 100),
      correctCount: correctAnswers,
      totalQuestions: currentQuiz.questions.length
    };
  };

  const handleCertificateGeneration = () => {
    const { score } = calculateScore();
    
    // Only generate certificate if score is passing (e.g., 70% or higher)
    if (score >= 70) {
      navigate(`/courses/generateCertificate?courseId=${id}&score=${score}`);
    } else {
      toast({
        title: "Certificate not available",
        description: "You need to score at least 70% to receive a certificate",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers(new Array(currentQuiz.questions.length).fill(null));
    setShowResults(false);
    setQuizStarted(false);
    setIsAnswerSubmitted(false);
    setTimeLeft(60);
  };

  if (!currentQuiz) {
    return (
      <Center h="100vh">
        <CircularProgress isIndeterminate color="teal.400" />
      </Center>
    );
  }

  // Welcome screen
  if (!quizStarted && !showResults) {
    return (
      <Container maxW="4xl" py={8}>
        <Card overflow="hidden" variant="outline" boxShadow="lg" borderRadius="lg">
          <CardBody>
            <Center flexDirection="column" p={6}>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3429/3429498.png"
                alt="Quiz"
                boxSize="150px"
                mb={4}
              />
              <Heading size="xl" mb={2}>{currentQuiz.title}</Heading>
              <Text mb={4} color="gray.600">{currentQuiz.description}</Text>
              <Text mb={4}>
                <Badge colorScheme="green" fontSize="0.9em" p={1}>
                  {currentQuiz.questions.length} Questions
                </Badge>
                <Badge colorScheme="purple" fontSize="0.9em" p={1} ml={2}>
                  <TimeIcon mr={1} /> 1 minute per question
                </Badge>
              </Text>
              <Text mb={4} color="gray.600">
                Answer correctly to earn your certificate!
              </Text>
              <Button 
                colorScheme="teal" 
                size="lg" 
                onClick={startQuiz}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Start Quiz
              </Button>
            </Center>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Results screen
  if (showResults) {
    const { score, correctCount, totalQuestions } = calculateScore();
    const isPassing = score >= 70;

    return (
      <Container maxW="4xl" py={8}>
        <Card overflow="hidden" variant="outline" boxShadow="lg" borderRadius="lg">
          <CardBody>
            <Center flexDirection="column" p={6}>
              <Heading size="xl" mb={6}>
                Quiz Results
              </Heading>

              <Box mb={8} w="100%">
                <CircularProgress 
                  value={score} 
                  size="200px" 
                  color={isPassing ? "green.400" : "red.400"}
                  thickness="8px"
                >
                  <CircularProgressLabel fontSize="2xl" fontWeight="bold">
                    {score}%
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>

              <Stat mb={6}>
                <StatLabel fontSize="lg">Your Score</StatLabel>
                <StatNumber>{correctCount} / {totalQuestions} correct</StatNumber>
                <StatHelpText>
                  {isPassing ? (
                    <Text color="green.500" fontWeight="bold">
                      <CheckCircleIcon mr={2} />
                      Congratulations! You passed the quiz.
                    </Text>
                  ) : (
                    <Text color="red.500" fontWeight="bold">
                      <WarningIcon mr={2} />
                      You didn't reach the passing score of 70%.
                    </Text>
                  )}
                </StatHelpText>
              </Stat>

              <HStack spacing={4} mt={4}>
                <Button 
                  colorScheme="teal" 
                  onClick={handleRetry}
                >
                  Retry Quiz
                </Button>
                <Button 
                  colorScheme="green" 
                  onClick={handleCertificateGeneration}
                  isDisabled={!isPassing}
                >
                  {isPassing ? "Get Certificate" : "Certificate Unavailable"}
                </Button>
              </HStack>
            </Center>
          </CardBody>
        </Card>

        <Card mt={6} variant="outline" boxShadow="md">
          <CardBody>
            <Heading size="md" mb={4}>Question Analysis</Heading>
            <VStack align="stretch" spacing={4}>
              {currentQuiz.questions.map((question, index) => (
                <Box 
                  key={question.id} 
                  p={4} 
                  borderWidth="1px" 
                  borderRadius="md"
                  borderColor={answers[index] === question.answer ? "green.200" : "red.200"}
                  bg={answers[index] === question.answer ? "green.50" : "red.50"}
                >
                  <HStack>
                    <Text fontWeight="bold">Q{index + 1}:</Text>
                    <Text>{question.question}</Text>
                  </HStack>
                  
                  <HStack mt={2}>
                    <Text fontWeight="bold">Your answer:</Text>
                    <Text color={answers[index] === question.answer ? "green.500" : "red.500"}>
                      {answers[index] || "No answer selected"}
                    </Text>
                  </HStack>
                  
                  {answers[index] !== question.answer && (
                    <HStack mt={1}>
                      <Text fontWeight="bold">Correct answer:</Text>
                      <Text color="green.500">{question.answer}</Text>
                    </HStack>
                  )}
                  
                  <Text mt={2} fontSize="sm" color="gray.600">
                    <Text as="span" fontWeight="bold">Explanation: </Text>
                    {question.explanation}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Quiz in progress
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  return (
    <Container maxW="4xl" py={8}>
      <Card overflow="hidden" variant="outline" boxShadow="lg" borderRadius="lg">
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Badge colorScheme="purple" p={2} borderRadius="md">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </Badge>
            <Badge colorScheme={timeLeft < 10 ? "red" : "blue"} p={2} borderRadius="md">
              <TimeIcon mr={1} />
              {timeLeft} seconds
            </Badge>
          </Flex>

          <Progress
            value={(currentQuestionIndex / currentQuiz.questions.length) * 100}
            size="sm"
            colorScheme="teal"
            borderRadius="full"
            mb={6}
          />

          <Heading size="lg" mb={6}>
            {currentQuestion.question}
          </Heading>

          <RadioGroup onChange={handleAnswerSelect} value={selectedAnswer} isDisabled={isAnswerSubmitted}>
            <VStack spacing={4} align="stretch">
              {currentQuestion.options.map((option, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={
                    isAnswerSubmitted
                      ? option === currentQuestion.answer
                        ? "green.300"
                        : selectedAnswer === option
                          ? "red.300"
                          : "gray.200"
                      : "gray.200"
                  }
                  bg={
                    isAnswerSubmitted
                      ? option === currentQuestion.answer
                        ? "green.50"
                        : selectedAnswer === option
                          ? "red.50"
                          : "white"
                      : "white"
                  }
                  cursor={isAnswerSubmitted ? "default" : "pointer"}
                  _hover={isAnswerSubmitted ? {} : { bg: "gray.50", borderColor: "gray.300" }}
                >
                  <Radio value={option} colorScheme="teal">
                    {option}
                  </Radio>
                  {isAnswerSubmitted && option === currentQuestion.answer && (
                    <Text color="green.500" fontSize="sm" mt={2}>
                      <CheckCircleIcon mr={1} />
                      Correct answer: {currentQuestion.explanation}
                    </Text>
                  )}
                  {isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.answer && (
                    <Text color="red.500" fontSize="sm" mt={2}>
                      <WarningIcon mr={1} />
                      Incorrect answer
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </RadioGroup>

          <Flex mt={8} justify="space-between">
            {!isAnswerSubmitted ? (
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleAnswerSubmit}
                isDisabled={!selectedAnswer}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleNextQuestion}
                rightIcon={<CheckCircleIcon />}
              >
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Container>
  );
};

export default QuizPage;
