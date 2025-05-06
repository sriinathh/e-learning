import React, { useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid, Card, CardBody, Image, 
         Stack, Text, Button, Flex, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 'web-dev',
    title: 'The Complete Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    description: 'Learn HTML, CSS, JavaScript, React, Node and more with the most comprehensive web development course.',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721295.png',
    level: 'Beginner to Advanced',
    rating: 4.8,
    students: 768450
  },
  {
    id: 'react-masterclass',
    title: 'React - The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    description: 'Dive in and learn React.js from scratch! Learn Hooks, Redux, React Routing, Animations, Next.js and more!',
    image: 'https://cdn-icons-png.flaticon.com/512/1260/1260667.png',
    level: 'All Levels',
    rating: 4.7,
    students: 689540
  },
  {
    id: 'python-ml',
    title: 'Python for Data Science and ML',
    instructor: 'Jose Portilla',
    description: 'Learn Python for data analysis, visualization, and machine learning with NumPy, Pandas, Matplotlib, and Scikit-Learn.',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721286.png',
    level: 'Intermediate',
    rating: 4.6,
    students: 542300
  },
  {
    id: 'js-algorithms',
    title: 'JavaScript Algorithms and Data Structures',
    instructor: 'Colt Steele',
    description: 'Master the fundamentals of JavaScript and learn the most common algorithms and data structures.',
    image: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
    level: 'Intermediate',
    rating: 4.7,
    students: 432150
  },
  {
    id: 'mobile-dev',
    title: 'Flutter & Dart - The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    description: 'Learn Flutter and Dart from the ground up, build beautiful native mobile apps for iOS and Android.',
    image: 'https://cdn-icons-png.flaticon.com/512/6132/6132221.png',
    level: 'Beginner to Advanced',
    rating: 4.6,
    students: 321450
  },
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals & Machine Learning',
    instructor: 'Andrew Ng',
    description: 'Build intelligent applications with deep learning, neural networks, computer vision, and natural language processing.',
    image: 'https://cdn-icons-png.flaticon.com/512/2103/2103470.png',
    level: 'Advanced',
    rating: 4.9,
    students: 428760
  }
];

const SimpleCoursePage = () => {
  useEffect(() => {
    console.log('SimpleCoursePage component mounted');
    document.title = 'Browse Courses - EduConnect';
  }, []);

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={8} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Explore Our Courses
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Enhance your skills with our comprehensive courses designed by industry experts
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {courses.map((course) => (
          <Card key={course.id} overflow="hidden" variant="outline">
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
                <Text color="gray.500">{course.instructor}</Text>
                <Flex align="center" mt={1}>
                  <Badge colorScheme="teal" mr={2}>{course.level}</Badge>
                  <Text fontWeight="bold" mr={1}>{course.rating}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ({course.students.toLocaleString()} students)
                  </Text>
                </Flex>
                <Text py={2}>{course.description}</Text>
                <Flex mt={4} justifyContent="space-between">
                  <Link to={`/courses`}>
                    <Button colorScheme="blue" variant="outline">
                      Course Details
                    </Button>
                  </Link>
                  <Link to={`/udemy-course/${course.id}`}>
                    <Button colorScheme="teal">
                      Enhanced View
                    </Button>
                  </Link>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default SimpleCoursePage; 