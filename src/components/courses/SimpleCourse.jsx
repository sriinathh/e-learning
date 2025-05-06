import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stack, Button, Image, Badge, Flex, HStack } from "@chakra-ui/react";

const coursesData = [
  {
    id: 'web-dev',
    title: "The Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    image: "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
    description: "Master HTML, CSS, JavaScript, React, Node and more with the most comprehensive web development course.",
  },
  {
    id: 'react-masterclass',
    title: "React - The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    image: "https://cdn-icons-png.flaticon.com/512/1260/1260667.png",
    description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and more!",
  },
  {
    id: 'python-ml',
    title: "Python for Data Science and Machine Learning",
    instructor: "Jose Portilla",
    image: "https://cdn-icons-png.flaticon.com/512/2721/2721286.png",
    description: "Learn Python and how to use it to analyze data, create beautiful visualizations, and use powerful machine learning algorithms.",
  }
];

const SimpleCourse = () => {
  useEffect(() => {
    console.log("SimpleCourse component mounted");
    document.title = "Available Courses - EduConnect";
  }, []);

  return (
    <Box p={8}>
      <Heading as="h1" mb={6}>Available Courses</Heading>
      <Text mb={4}>Explore our selection of comprehensive courses designed to help you master new skills.</Text>
      
      <HStack spacing={4} mb={8}>
        <Link to="/courses">
          <Button colorScheme="blue">View Original Courses Page</Button>
        </Link>
        <Link to="/simple-course">
          <Button colorScheme="green">Refresh This Page</Button>
        </Link>
      </HStack>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {coursesData.map(course => (
          <Card key={course.id} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <CardBody>
              <Flex justify="center" mb={4}>
                <Image
                  src={course.image}
                  alt={course.title}
                  borderRadius="lg"
                  boxSize="100px"
                />
              </Flex>
              <Stack mt={2}>
                <Heading size="md">{course.title}</Heading>
                <Text color="gray.500">Instructor: {course.instructor}</Text>
                <Text py={2}>{course.description}</Text>
                <Flex mt={2} justifyContent="space-between">
                  <Button colorScheme="blue" variant="outline">
                    View Details
                  </Button>
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
    </Box>
  );
};

export default SimpleCourse; 