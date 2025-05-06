import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
  Image,
  Divider,
  Checkbox,
  HStack,
  Container,
  useColorModeValue,
  IconButton,
  ScaleFade
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaSignInAlt, FaGoogle, FaUniversity } from 'react-icons/fa';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

// Keyframes for animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Animation
  const floatAnimation = `${float} 5s ease-in-out infinite`;
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.300)",
    "linear(to-r, blue.700, purple.600)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const highlightColor = useColorModeValue("blue.500", "blue.300");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if server is reachable
      try {
        await axios.get('http://localhost:5001/api/health-check');
      } catch (serverError) {
        console.error('Server connection failed:', serverError);
        throw new Error('Server connection failed. Please ensure the backend server is running.');
      }
      
      // Make the actual login request
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password
      });
      
      if (response.data) {
        // Ensure user data has the correct format for MongoDB
        const userData = {
          ...response.data,
          _id: response.data._id || response.data.userId, // Ensure _id exists
          hasCustomAvatar: !!response.data.profilePic
        };
        
        console.log('Login successful, user data:', userData);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Initialize communityUsers if not already set
        try {
          let communityUsers = [];
          const storedUsers = localStorage.getItem('communityUsers');
          
          if (storedUsers) {
            communityUsers = JSON.parse(storedUsers);
          }
          
          // Check if current user exists in community
          const userExists = communityUsers.some(user => user._id === userData._id);
          
          if (!userExists) {
            // Add current user to community
            communityUsers.push({
              _id: userData._id,
              username: userData.username || userData.name,
              isOnline: true,
              profilePic: userData.profilePic || userData.profilePicture || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username || userData.name)}&background=random`,
              isReal: true,
              joinedAt: new Date().toISOString()
            });
            
            // Store updated community users
            localStorage.setItem('communityUsers', JSON.stringify(communityUsers));
          }
        } catch (error) {
          console.error('Error initializing community users:', error);
        }
        
        // Show success message
        toast({
          title: 'Login Successful',
          description: `Welcome, ${userData.username || userData.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        // Redirect to home page
        navigate('/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login';
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: 'Google Login',
      description: 'Google login integration will be implemented soon',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  const handleCollegeLogin = () => {
    toast({
      title: 'College Domain Login',
      description: 'College domain login integration will be implemented soon',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
      bgAttachment="fixed"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      <MotionBox 
        position="absolute"
        top="-5%"
        left="10%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(255,255,255,0.1)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      <MotionBox 
        position="absolute"
        bottom="-10%"
        right="15%"
        w="250px"
        h="250px"
        borderRadius="full"
        bg="rgba(255,255,255,0.05)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Panel - Image */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <MotionText 
                fontSize="4xl" 
                fontWeight="bold" 
                mb={4}
                bgGradient="linear(to-r, blue.100, purple.100)"
                bgClip="text"
              >
                Welcome Back to Campus Connect
              </MotionText>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              animation={floatAnimation}
            >
              <Text fontSize="lg" maxW="400px">
                Connect, chat, and share with like-minded individuals. Dive into meaningful conversations and build relationships with your campus community.
              </Text>
            </MotionBox>
            
            {/* Floating elements */}
            <HStack spacing={4} mt={10}>
              <MotionBox 
                animation={floatAnimation}
                transition={{ delay: 0.3 }}
                p={4}
                bg="whiteAlpha.200"
                borderRadius="xl"
                boxShadow="md"
              >
                <Text fontWeight="bold">500+</Text>
                <Text fontSize="sm">Active Users</Text>
              </MotionBox>
              
              <MotionBox 
                animation={floatAnimation}
                transition={{ delay: 0.5 }}
                p={4}
                bg="whiteAlpha.200"
                borderRadius="xl"
                boxShadow="md"
              >
                <Text fontWeight="bold">24/7</Text>
                <Text fontSize="sm">Support</Text>
              </MotionBox>
            </HStack>
          </Box>
        </Box>

        {/* Right Panel - Login Form */}
        <Box
          w={["100%", "100%", "50%"]}
          bg={cardBg}
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          as={motion.div}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" mb={6}>
            <Text 
              fontSize="3xl" 
              fontWeight="bold" 
              color={highlightColor}
              as={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Sign In
            </Text>
            <Text 
              fontSize="md" 
              color="gray.600"
              as={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Continue your campus journey
            </Text>
          </Box>

          <ScaleFade initialScale={0.9} in={true}>
            <VStack spacing={5} w="100%" maxW="400px" mx="auto">
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <InputGroup>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Your email address"
                    bg="gray.50"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                  <InputRightElement>
                    <Icon as={FiMail} color="gray.500" />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    bg="gray.50"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Flex w="100%" justify="flex-end">
                <Text 
                  fontSize="sm" 
                  color={highlightColor} 
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot password?
                </Text>
              </Flex>
              
              <Button
                onClick={handleLogin}
                isLoading={isLoading}
                loadingText="Signing In"
                colorScheme="blue"
                size="lg"
                width="100%"
                leftIcon={<Icon as={FiLogIn} />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
                mt={2}
              >
                Sign In
              </Button>
              
              <Divider my={2} />
              
              <Text textAlign="center">
                Don't have an account?{" "}
                <RouterLink to="/register">
                  <Text as="span" color={highlightColor} fontWeight="medium" cursor="pointer">
                    Register now
                  </Text>
                </RouterLink>
              </Text>
              
              {/* Social login options */}
              <VStack w="100%" spacing={3} mt={2}>
                <Button 
                  w="100%" 
                  leftIcon={<FaGoogle />} 
                  variant="outline" 
                  colorScheme="red"
                  _hover={{ bg: "red.50" }}
                >
                  Sign in with Google
                </Button>
                <Button 
                  w="100%" 
                  leftIcon={<FaUniversity />} 
                  variant="outline" 
                  colorScheme="blue"
                  _hover={{ bg: "blue.50" }}
                >
                  Sign in with College ID
                </Button>
              </VStack>
            </VStack>
          </ScaleFade>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
