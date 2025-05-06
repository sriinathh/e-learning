import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiShield,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiMonitor,
  FiAward,
} from "react-icons/fi";

const Feature = ({ title, text, icon, badges = [] }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      p={6}
      spacing={4}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
      transition="all 0.3s ease"
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg={useColorModeValue("teal.500", "teal.400")}
      >
        {icon}
      </Flex>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text fontWeight={600} fontSize="lg">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="subtle"
              rounded="full"
              px={2}
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
      </Box>
    </Stack>
  );
};

const LandingPage = () => {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
      {/* Hero Section */}
      <Container maxW="7xl" pt={10}>
        <Stack
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text
                as="span"
                position="relative"
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "teal.400",
                  zIndex: -1,
                }}
              >
                <b>CampusConnect</b>
              </Text>
              <br />
              <Text as="span" color="teal.400">
                Learn. Grow. Succeed.
              </Text>
            </Heading>
            <Text color="gray.500" fontSize="xl">
              Master in-demand skills with top-rated courses, interactive
              learning paths, and real mentors guiding your journey to success.
              Whether you're a student or professional, we've got you covered.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/register"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                colorScheme="teal"
                bg="teal.400"
                _hover={{ bg: "teal.500" }}
                leftIcon={<FiUserPlus />}
              >
                Join Now
              </Button>
              <Button
                as={RouterLink}
                to="/CourseList"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                variant="outline"
                colorScheme="teal"
                leftIcon={<FiLogIn />}
              >
                Browse Courses
              </Button>
            </Stack>
          </Stack>

          {/* Image / Preview Section */}
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height="450px"
              rounded="2xl"
              boxShadow="2xl"
              width="full"
              overflow="hidden"
              bg="white"
              p={6}
              border="1px solid"
              borderColor="gray.200"
              textAlign="center"
            >
              <Heading size="md" color="teal.600" mb={4}>
                🔥 Popular Course: Full-Stack Web Development
              </Heading>
              <Text color="gray.600" fontSize="sm" mb={4}>
                Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and more.
                Real projects, real mentorship.
              </Text>
              <Badge colorScheme="green">Enrolling Now</Badge>
            </Box>
          </Flex>
        </Stack>

        {/* Features */}
        <Box py={20}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading fontSize="4xl">Why Choose SkillSpark?</Heading>
            <Text fontSize="lg" color="gray.500">
              All-in-one platform to boost your knowledge and skills
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            px={{ base: 4, md: 8 }}
          >
            <Feature
              icon={<Icon as={FiBookOpen} w={10} h={10} />}
              title="Expert-Curated Courses"
              badges={[{ text: "Top Rated", color: "green" }]}
              text="Courses designed by industry professionals to meet real-world demands."
            />
            <Feature
              icon={<Icon as={FiAward} w={10} h={10} />}
              title="Certifications"
              badges={[{ text: "Verified", color: "purple" }]}
              text="Earn certificates to boost your resume and LinkedIn profile."
            />
            <Feature
              icon={<Icon as={FiMonitor} w={10} h={10} />}
              title="Live Classes"
              badges={[{ text: "Interactive", color: "blue" }]}
              text="Attend live sessions, ask doubts, and interact with peers and mentors."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title="Mentor Support"
              badges={[{ text: "1-on-1", color: "orange" }]}
              text="Get personal guidance and feedback from experienced mentors."
            />
            <Feature
              icon={<Icon as={FiShield} w={10} h={10} />}
              title="Safe & Secure"
              badges={[{ text: "Protected", color: "red" }]}
              text="Your data is encrypted and your learning environment is safe."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title="Learn Anywhere"
              badges={[{ text: "Flexible", color: "blue" }]}
              text="Access courses from mobile, desktop, or tablet—anytime, anywhere."
            />
          </SimpleGrid>
        </Box>

        {/* Final Call To Action */}
        <Box py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            align="center"
            justify="center"
            bg={useColorModeValue("teal.50", "teal.900")}
            p={10}
            rounded="xl"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading size="lg">Start Your Learning Journey Today</Heading>
              <Text color="gray.600" fontSize="lg">
                Join thousands of learners already boosting their skills.
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="teal"
              bg="teal.400"
              _hover={{ bg: "teal.500" }}
              leftIcon={<FiUserPlus />}
            >
              Join Now
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
