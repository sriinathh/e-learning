import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/users/register", {
        email,
        password,
        username,
      });

      console.log("User registered:", data.user);
      setLoading(false);
      toast({
        title: "Registration successful!",
        description: "Welcome to EduConnect. You can now log in.",
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
      bgGradient="linear(to-r, teal.400, green.300)"
    >
      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Image Panel */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1584697964403-e5b4f7a81c34?auto=format&fit=crop&w=800&q=80')"
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
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Welcome to EduConnect
            </Text>
            <Text fontSize="lg" maxW="400px">
              Join a vibrant community of learners, instructors, and professionals. Sign up now to get started.
            </Text>
          </Box>
        </Box>

        {/* Form Panel */}
        <Box
          w={["100%", "100%", "50%"]}
          bg="white"
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box textAlign="center" mb={6}>
            <Text fontSize="3xl" fontWeight="bold" color="teal.600">
              Register
            </Text>
            <Text fontSize="md" color="gray.600">
              Begin your educational journey with us
            </Text>
          </Box>

          <VStack spacing={5} w="100%" maxW="400px" mx="auto">
            <FormControl id="username" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="e.g. Srinath"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="e.g. srinath@example.com"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Create Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Choose a strong password"
              />
            </FormControl>
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              colorScheme="teal"
              width="100%"
              mt={4}
            >
              Register
            </Button>
            <Text>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#319795", fontWeight: "500" }}>
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
