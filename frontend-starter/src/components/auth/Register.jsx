import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
  Image,
  FormHelperText,
  Progress,
  HStack,
  Divider,
  Container,
  Checkbox,
  Link,
  useColorModeValue,
  ScaleFade,
  SlideFade
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserPlus, FaGoogle, FaUniversity, FaEnvelope, FaLock, FaUserAlt } from 'react-icons/fa';
import axios from "axios";

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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const toast = useToast();
  const navigate = useNavigate();

  // Animation
  const floatAnimation = `${float} 5s ease-in-out infinite`;
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.400, green.300)",
    "linear(to-r, teal.700, green.600)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const highlightColor = useColorModeValue("teal.500", "teal.300");

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase letters
    if (/[A-Z]/.test(password)) strength += 25;
    // Contains numbers or special characters
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;

    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  
  const getStrengthColor = (strength) => {
    if (strength < 25) return "red.500";
    if (strength < 50) return "orange.500";
    if (strength < 75) return "yellow.500";
    return "green.500";
  };

  const getStrengthText = (strength) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // Validation
  const validateFirstStep = () => {
    if (!firstName || !lastName || !username) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateFirstStep()) {
      setStep(2);
    } else if (step === 2 && validateSecondStep()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (passwordStrength < 50) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password with uppercase, lowercase, numbers, and special characters",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!termsAccepted) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to continue",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);

    try {
      // For demo, we'll store the user in localStorage
      const userData = {
        firstName,
        lastName,
        username,
        email,
        _id: 'user-' + Date.now(),
        joinedAt: new Date().toISOString(),
        profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random`,
        isOnline: true
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Initialize community users
      try {
        let communityUsers = [];
        const storedUsers = localStorage.getItem('communityUsers');
        
        if (storedUsers) {
          communityUsers = JSON.parse(storedUsers);
        }
        
        // Add current user to community
        communityUsers.push({
          _id: userData._id,
          username: userData.username,
          isOnline: true,
          profilePic: userData.profilePic,
          isReal: true,
          joinedAt: userData.joinedAt
        });
        
        // Store updated community users
        localStorage.setItem('communityUsers', JSON.stringify(communityUsers));
      } catch (error) {
        console.error('Error initializing community users:', error);
      }
      
      setLoading(false);
      toast({
        title: "Registration successful!",
        description: "Welcome to Campus Connect. You can now log in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
        top="-10%"
        right="5%"
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
        bottom="-5%"
        left="10%"
        w="200px"
        h="200px"
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
        {/* Image Panel */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1605369450736-5b3265fe9b10?auto=format&fit=crop&w=800&q=80')"
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
            bg="blackAlpha.700"
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
                bgGradient="linear(to-r, teal.100, green.100)"
                bgClip="text"
              >
                Welcome to Campus Connect
              </MotionText>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              animation={floatAnimation}
            >
              <Text fontSize="lg" maxW="400px">
                Join our vibrant campus community where every connection matters. Sign up today to engage, learn, and grow together with peers who share your academic journey.
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
                <Text fontWeight="bold">50+</Text>
                <Text fontSize="sm">Communities</Text>
              </MotionBox>
              
              <MotionBox 
                animation={floatAnimation}
                transition={{ delay: 0.7 }}
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

        {/* Form Panel */}
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
              Create Your Account
            </Text>
            <Text 
              fontSize="md" 
              color="gray.600"
              as={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Begin your campus journey with us
            </Text>
          </Box>

          {/* Multi-step progress */}
          <HStack mb={6} spacing={2} justify="center">
            {[1, 2, 3].map((i) => (
              <Box 
                key={i}
                w={i === step ? "10px" : "8px"}
                h={i === step ? "10px" : "8px"}
                borderRadius="full"
                bg={i <= step ? highlightColor : "gray.300"}
                transition="all 0.3s ease"
                cursor={i < step ? "pointer" : "default"}
                onClick={() => i < step && setStep(i)}
              />
            ))}
          </HStack>

          {/* Step indicator */}
          <Text 
            mb={4} 
            fontWeight="medium" 
            color="gray.600"
            textAlign="center"
          >
            Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Contact Details" : "Security"}
          </Text>

          {/* Form steps */}
          <VStack spacing={5} w="100%" maxW="400px" mx="auto">
            {step === 1 && (
              <ScaleFade initialScale={0.9} in={step === 1}>
                <VStack spacing={4} w="100%">
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <InputGroup>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="e.g. John"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <InputGroup>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        placeholder="e.g. Doe"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <InputGroup>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="e.g. johndoe123"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                    </InputGroup>
                    <FormHelperText>This will be your display name</FormHelperText>
                  </FormControl>
                </VStack>
              </ScaleFade>
            )}
            
            {step === 2 && (
              <ScaleFade initialScale={0.9} in={step === 2}>
                <VStack spacing={4} w="100%">
                  <FormControl id="email" isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <InputGroup>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="e.g. john.doe@example.com"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                    </InputGroup>
                    <FormHelperText>We'll never share your email</FormHelperText>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Profile Picture</FormLabel>
                    <Flex 
                      align="center" 
                      justify="center" 
                      bg="gray.50" 
                      borderRadius="md" 
                      p={4} 
                      borderWidth="1px"
                      borderColor="gray.300"
                      borderStyle="dashed"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                    >
                      <VStack>
                        <Icon as={FaUserAlt} boxSize={10} color="gray.400" />
                        <Text fontSize="sm" color="gray.500">Assigned automatically based on your name</Text>
                      </VStack>
                    </Flex>
                  </FormControl>
                </VStack>
              </ScaleFade>
            )}
            
            {step === 3 && (
              <ScaleFade initialScale={0.9} in={step === 3}>
                <VStack spacing={4} w="100%">
                  <FormControl id="password" isRequired>
                    <FormLabel>Create Password</FormLabel>
                    <InputGroup>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        />
                      </InputRightElement>
                    </InputGroup>
                    
                    <Box mt={2}>
                      <Progress 
                        value={passwordStrength} 
                        size="sm" 
                        colorScheme={getStrengthColor(passwordStrength).split('.')[0]} 
                        borderRadius="full" 
                      />
                      <Text fontSize="xs" mt={1} textAlign="right" color={getStrengthColor(passwordStrength)}>
                        {getStrengthText(passwordStrength)}
                      </Text>
                    </Box>
                  </FormControl>
                  
                  <FormControl id="confirmPassword" isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {confirmPassword && password !== confirmPassword && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        Passwords do not match
                      </Text>
                    )}
                  </FormControl>
                  
                  <Checkbox 
                    colorScheme="teal" 
                    isChecked={termsAccepted} 
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  >
                    <Text fontSize="sm">
                      I accept the <Link color={highlightColor} href="#">Terms of Service</Link> and <Link color={highlightColor} href="#">Privacy Policy</Link>
                    </Text>
                  </Checkbox>
                </VStack>
              </ScaleFade>
            )}
            
            {/* Navigation buttons */}
            <HStack w="100%" justifyContent={step === 1 ? "flex-end" : "space-between"} mt={6}>
              {step > 1 && (
                <Button 
                  onClick={handlePrevStep} 
                  variant="outline" 
                  colorScheme="teal"
                  leftIcon={<Icon as={FaUserPlus} />}
                  _hover={{ bg: "teal.50" }}
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button 
                  onClick={handleNextStep} 
                  colorScheme="teal" 
                  rightIcon={<Icon as={FaUserPlus} />}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText="Creating Account"
                  colorScheme="teal"
                  rightIcon={<Icon as={FaUserPlus} />}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Register
                </Button>
              )}
            </HStack>
            
            <Divider my={2} />
            
            <Text textAlign="center">
              Already have an account?{" "}
              <Link as={RouterLink} to="/login" color={highlightColor} fontWeight="medium">
                Sign in
              </Link>
            </Text>
            
            {/* Social registration options */}
            <VStack w="100%" spacing={3} mt={2}>
              <Button 
                w="100%" 
                leftIcon={<FaGoogle />} 
                variant="outline" 
                colorScheme="red"
                _hover={{ bg: "red.50" }}
              >
                Register with Google
              </Button>
              <Button 
                w="100%" 
                leftIcon={<FaUniversity />} 
                variant="outline" 
                colorScheme="blue"
                _hover={{ bg: "blue.50" }}
              >
                Register with College ID
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
