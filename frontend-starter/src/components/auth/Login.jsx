import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Container,
  Image,
  Flex,
  InputGroup,
  InputRightElement,
  Icon
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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

  return (
    <Container maxW="container.xl" py={12}>
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="center">
        <Box flex={1} display={{ base: 'none', md: 'block' }} mr={8}>
          <Image 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
            alt="College Students"
            borderRadius="lg"
            boxShadow="lg"
          />
        </Box>
        
        <Box 
          flex={1} 
          p={8} 
          borderWidth={1} 
          borderRadius="lg" 
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={8} align="flex-start">
            <VStack spacing={2} align="flex-start" w="full">
              <Heading size="xl">Welcome Back</Heading>
              <Text color="gray.600">Log in to continue to EduConnect</Text>
            </VStack>
            
            <VStack as="form" spacing={6} w="full" onSubmit={handleLogin}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.5rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Button
                colorScheme="blue"
                width="full"
                type="submit"
                isLoading={isLoading}
              >
                Log In
              </Button>
              
              <Link href="/forgot-password" alignSelf="flex-end" color="blue.500" fontSize="sm">
                Forgot password?
              </Link>
            </VStack>
            
            <Text alignSelf="center">
              Don't have an account?{' '}
              <Link href="/register" color="blue.500">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
