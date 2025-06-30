import { useState, useEffect } from "react";
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Avatar, 
  Flex, 
  Icon, 
  Input, 
  Button,
  Badge,
  Tabs, 
  TabList,
  TabPanels,
  Tab, 
  TabPanel,
  Progress,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl, 
  FormLabel,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { 
  FiCamera, 
  FiMail, 
  FiUser, 
  FiCalendar, 
  FiCheckCircle, 
  FiAward, 
  FiBook, 
  FiLogOut,
  FiTrendingUp,
  FiUserCheck,
  FiStar,
  FiPieChart
} from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

// Sample data for demonstrations
const SAMPLE_LEADERBOARD = [
  { id: 1, name: "Rahul Sharma", points: 1250, rank: 1, avatar: "https://bit.ly/ryan-florence" },
  { id: 2, name: "Priya Patel", points: 1180, rank: 2, avatar: "https://bit.ly/sage-adebayo" },
  { id: 3, name: "Amit Kumar", points: 1095, rank: 3, avatar: "https://bit.ly/kent-c-dodds" },
  { id: 4, name: "Sneha Reddy", points: 980, rank: 4, avatar: "https://bit.ly/prosper-baba" },
  { id: 5, name: "Karthik Iyer", points: 960, rank: 5, avatar: "https://bit.ly/code-beast" },
];

const SAMPLE_COURSES = [
  { id: 1, name: "Web Development Fundamentals", progress: 85, certificate: true },
  { id: 2, name: "Data Structures and Algorithms", progress: 67, certificate: false },
  { id: 3, name: "Machine Learning Basics", progress: 40, certificate: false },
  { id: 4, name: "Python Programming", progress: 100, certificate: true },
];

const SAMPLE_ACHIEVEMENTS = [
  { id: 1, name: "Quick Learner", description: "Completed 3 courses in one month", icon: FiTrendingUp },
  { id: 2, name: "Participation Star", description: "Participated in 5 community forums", icon: FiUserCheck },
  { id: 3, name: "Perfect Score", description: "Got 100% on an assessment", icon: FiStar },
  { id: 4, name: "Consistent Learner", description: "Logged in for 30 consecutive days", icon: FiPieChart },
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [leaderboard, setLeaderboard] = useState(SAMPLE_LEADERBOARD);
  const [courses, setCourses] = useState(SAMPLE_COURSES);
  const [achievements, setAchievements] = useState(SAMPLE_ACHIEVEMENTS);
  const [userRank, setUserRank] = useState(null);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let storedUser = localStorage.getItem("user");
        
        if (!storedUser) {
          throw new Error("User not found");
        }
        
        try {
          storedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          throw new Error("Invalid user data format");
        }
        
        console.log("User data from localStorage:", storedUser);
        
        // Make sure we have the _id field for MongoDB compatibility
        if (!storedUser._id && storedUser.userId) {
          storedUser._id = storedUser.userId;
          console.log("Added _id from userId:", storedUser._id);
          // Update localStorage with the _id field
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
        
        // If we have a token, validate with backend to get fresh user data
        if (storedUser.token) {
          try {
            // Get fresh user data from server
            const userId = storedUser._id || storedUser.userId;
            
            if (userId) {
              console.log("Fetching fresh user data from server for ID:", userId);
              const response = await axios.get(`http://localhost:5001/api/users/profile/${userId}`);
              
              if (response.data) {
                console.log("Got fresh user data from server:", response.data);
                
                // Merge with stored data, keeping the token
                const freshUser = {
                  ...response.data,
                  token: storedUser.token
                };
                
                // Update localStorage
                localStorage.setItem("user", JSON.stringify(freshUser));
                storedUser = freshUser;
              }
            }
          } catch (serverError) {
            console.error("Could not fetch fresh user data:", serverError);
            // Continue with locally stored data
          }
        }
        
        // Ensure we have a profilePic property
        if (!storedUser.profilePic && storedUser.profilePicture) {
          storedUser.profilePic = storedUser.profilePicture;
        } else if (!storedUser.profilePic) {
          // Generate a default avatar using initial letters
          const name = storedUser.name || storedUser.username || "User";
          storedUser.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }
        
        // Update localStorage with the normalized user object
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        setUser(storedUser);
        setFormData({
          username: storedUser.username || storedUser.name || '',
          email: storedUser.email || ''
        });

        // Simulating user rank (in real app, fetch from API)
        const randomRank = Math.floor(Math.random() * 10) + 6;
        setUserRank({
          rank: randomRank,
          points: 900 - (randomRank * 10),
          total_users: 156
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error loading profile",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 1MB for better performance)
    if (file.size > 1 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 1MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Start loading
    console.log("Starting image upload process");

    try {
      // Read file as base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          console.log("File read successful");
          // Set preview image immediately
          setSelectedImg(reader.result);
          
          // Create a very small image for database storage
          const img = new Image();
          
          // Set up an onload handler for the image
          img.onload = async () => {
            try {
              console.log("Image loaded successfully, dimensions:", img.width, "x", img.height);
              // Create a canvas to resize the image
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Calculate new dimensions (max 150px width or height)
              const maxDim = 150;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > maxDim) {
                  height = Math.round(height * (maxDim / width));
                  width = maxDim;
                }
              } else {
                if (height > maxDim) {
                  width = Math.round(width * (maxDim / height));
                  height = maxDim;
                }
              }
              
              console.log("Resizing to:", width, "x", height);
              // Set canvas dimensions and draw resized image
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              // Get resized image as base64 with reduced quality
              const resizedImage = canvas.toDataURL('image/jpeg', 0.5);
              console.log("Image resized, base64 length:", resizedImage.length);
              
              // Save the image to the server
              const userData = user._id ? user : JSON.parse(localStorage.getItem("user"));
              
              // Ensure we have a valid MongoDB ObjectId
              const userId = userData._id;
              
              console.log("Attempting server connection with user ID:", userId);
              
              // Only attempt to call the API if we have what looks like a valid ID
              if (userId) {
                try {
                  // First check if the server is available
                  await axios.get("http://localhost:5001/api/health-check")
                    .catch(err => {
                      console.log("Server health check failed:", err.message);
                      throw new Error("Server unavailable");
                    });
                  
                  // Convert ID to string if it's not already
                  const idToUse = typeof userId === 'string' ? userId : userId.toString();
                  
                  // Send update request with explicit Content-Type
                  const response = await axios.post("http://localhost:5001/api/users/update-profile", 
                    {
                      userId: idToUse,
                      profilePic: resizedImage
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      timeout: 10000 // 10 second timeout
                    }
                  );
                  
                  console.log("Server response:", response.data);
                  
                  if (response && response.data && response.data.user) {
                    // Update the user in local state and localStorage
                    setUser(response.data.user);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    
                    toast({
                      title: "Success",
                      description: "Profile picture updated permanently in database",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  } else {
                    throw new Error(response?.data?.message || "Invalid server response");
                  }
                } catch (apiError) {
                  console.error("API error details:", apiError);
                  
                  if (apiError.message === "Server unavailable") {
                    // Handle server connection issues
                    toast({
                      title: "Server connection failed",
                      description: "Could not connect to the database server. Starting the server may solve this issue.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    // Add detailed error message for debugging
                    const errorDetails = apiError.response?.data?.message || 
                                       apiError.message || 
                                       "Unknown server error";
                    
                    console.log(`Server error details: ${errorDetails}`);
                    
                    toast({
                      title: "Database update failed",
                      description: `Could not save to database: ${errorDetails}. Your picture has been saved locally only.`,
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                  
                  // Still update locally as fallback
                  const updatedUser = { 
                    ...userData,
                    profilePic: resizedImage,
                    profilePicture: resizedImage,
                    avatar: resizedImage
                  };
                  
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                  setUser(updatedUser);
                }
              } else {
                console.log("Missing valid user ID, saving only locally");
                
                // Local-only update when no valid ID exists
                const updatedUser = { 
                  ...userData,
                  profilePic: resizedImage,
                  profilePicture: resizedImage,
                  avatar: resizedImage
                };
                
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                
                toast({
                  title: "Profile picture updated locally",
                  description: "No valid user ID found - your picture has been saved locally only. Please try logging in again.",
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                });
              }
            } catch (error) {
              console.error("Error processing image:", error);
              setSelectedImg(user.profilePic || null);
              
              toast({
                title: "Error updating profile picture",
                description: error.response?.data?.message || error.message || "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            } finally {
              setIsLoading(false); // Always end loading state
            }
          };

          // Handle image loading error
          img.onerror = () => {
            console.error("Error loading image");
            setIsLoading(false);
            setSelectedImg(user.profilePic || null);
            
            toast({
              title: "Error processing image",
              description: "Could not process the image. Please try another image.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          };
          
          // Set the source to start loading the image
          img.src = reader.result;
          
        } catch (error) {
          console.error("Error in image preprocessing:", error);
          setIsLoading(false);
          setSelectedImg(user.profilePic || null);
          
          toast({
            title: "Error processing image",
            description: "Could not process the image. Please try another image.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };
      
      // Handle file reader error
      reader.onerror = () => {
        console.error("FileReader error");
        setIsLoading(false);
        
        toast({
          title: "Error reading file",
          description: "There was a problem reading your image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsLoading(false);
      
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Get proper user ID
      const userData = user._id ? user : JSON.parse(localStorage.getItem("user"));
      const userId = userData._id;
      
      // Only attempt to call the API if we have a valid-looking ID
      if (userId && (typeof userId === 'string' && userId.length === 24)) {
        console.log("Updating profile for user ID:", userId);
        
        try {
          const { data } = await axios.post("http://localhost:5001/api/users/update-profile", {
            userId,
            username: formData.username,
            email: formData.email
          });
          
          console.log("Profile update response:", data);
          
          // Update localStorage with new user data
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          setIsEditing(false);
          
          toast({
            title: "Profile updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          console.error("Server error updating profile:", error);
          toast({
            title: "Error updating profile",
            description: error.response?.data?.message || error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          
          // Still update locally to preserve edits
          const updatedUser = {
            ...userData,
            username: formData.username,
            email: formData.email
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setIsEditing(false);
          
          toast({
            title: "Profile updated locally",
            description: "Your changes have been saved locally only.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Just update locally if no valid ID
        console.log("Invalid user ID format, saving only locally:", userId);
        
        const updatedUser = {
          ...userData,
          username: formData.username,
          email: formData.email
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        
        toast({
          title: "Profile updated locally",
          description: "Your changes have been saved locally only.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Open confirmation modal
    onOpen();
  };

  const confirmLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    
    // Show success message
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    // Close modal
    onClose();
    
    // Redirect to login page
    navigate("/login");
  };

  if (isLoading) {
    return (
      <Box textAlign="center" pt={10}>
        <Text fontSize="xl">Loading profile...</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" pt={10}>
        <Text fontSize="xl">Please log in to view your profile</Text>
        <Button mt={4} colorScheme="blue" onClick={() => window.location.href = "/login"}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box p={[4, 6, 8]} maxW="1200px" mx="auto">
      <Flex 
        direction={["column", "column", "row"]} 
        align={["center", "center", "flex-start"]}
        justify="space-between"
        mb={6}
        gap={[4, 6]}
      >
        <Flex direction={["column", "row"]} align="center" gap={4}>
          <Box position="relative">
            <Avatar 
              size="2xl" 
              name={user?.name || user?.username || "User"} 
              src={selectedImg || user?.profilePic || user?.profilePicture || user?.avatar} 
              border="3px solid" 
              borderColor="teal.400"
            />
            <Box
              position="absolute"
              bottom="3px"
              right="3px"
              bg="teal.500"
              p={1}
              borderRadius="full"
              cursor="pointer"
              as="label"
              htmlFor="profilePic"
            >
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <Icon as={FiCamera} color="white" boxSize={5} />
            </Box>
          </Box>
          
          <Box textAlign={["center", "left"]}>
            <Flex direction={["column", "row"]} gap={2} align={["center", "center", "flex-start"]}>
              {!isEditing ? (
                <Text fontSize="2xl" fontWeight="bold">{user?.name || user?.username || "User"}</Text>
              ) : (
                <FormControl>
                  <Input 
                    value={formData.username} 
                    name="username" 
                    onChange={handleInputChange} 
                    fontWeight="bold"
                    size="lg"
                  />
                </FormControl>
              )}
              {userRank && (
                <Badge colorScheme="teal" fontSize="md" ml={[0, 2]}>
                  Rank #{userRank.rank}
                </Badge>
              )}
            </Flex>
            
            <HStack spacing={2} mt={1} mb={2} justify={["center", "flex-start"]}>
              <Icon as={FiMail} color="gray.500" />
              {!isEditing ? (
                <Text color="gray.500">{user?.email}</Text>
              ) : (
                <FormControl>
                  <Input 
                    value={formData.email} 
                    name="email" 
                    onChange={handleInputChange} 
                    size="sm"
                  />
                </FormControl>
              )}
            </HStack>
            
            <HStack spacing={2} justify={["center", "flex-start"]}>
              <Icon as={FiCalendar} color="gray.500" />
              <Text color="gray.500">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </HStack>
          </Box>
        </Flex>
        
        <Flex direction="column" align={["center", "center", "flex-end"]} gap={3}>
          {isEditing ? (
            <HStack>
              <Button colorScheme="teal" onClick={handleSaveProfile}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
            </HStack>
          ) : (
            <HStack>
              <Button variant="outline" colorScheme="teal" onClick={handleEditToggle}>
                Edit Profile
              </Button>
              <ThemeSwitcher />
              <Button 
                colorScheme="red" 
                variant="outline" 
                leftIcon={<FiLogOut />}
                onClick={onOpen}
              >
                Logout
              </Button>
            </HStack>
          )}
          
          {userRank && (
            <Box 
              bg="gray.100" 
              p={3} 
              borderRadius="md" 
              width="100%" 
              maxW={["full", "full", "250px"]}
              textAlign="center"
            >
              <Text fontSize="sm" fontWeight="medium">My CampusConnect Points</Text>
              <Text fontSize="2xl" fontWeight="bold" color="teal.500">{userRank.points}</Text>
              <Progress 
                value={(userRank.rank > 1 ? 100 - ((userRank.rank / userRank.total_users) * 100) : 100)} 
                colorScheme="teal" 
                size="sm" 
                borderRadius="full" 
                mt={2}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Top {Math.round((userRank.rank / userRank.total_users) * 100)}% of all users
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
      
      {/* Tabs for different sections */}
      <Tabs colorScheme="teal" isLazy variant="enclosed">
        <TabList>
          <Tab><Icon as={FiUser} mr={2} />Profile</Tab>
          <Tab><Icon as={FiBook} mr={2} />Courses</Tab>
          <Tab><Icon as={FiAward} mr={2} />Achievements</Tab>
          <Tab><Icon as={FiTrendingUp} mr={2} />Leaderboard</Tab>
        </TabList>
        
        <TabPanels>
          {/* Profile Tab */}
          <TabPanel>
            <SimpleGrid columns={[1, 1, 3]} spacing={6}>
              <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm">
                <StatLabel color="gray.500">Courses Enrolled</StatLabel>
                <StatNumber color="teal.500">{user?.coursesEnrolled || 4}</StatNumber>
                <StatHelpText>Learning Journey</StatHelpText>
              </Stat>
              
              <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm">
                <StatLabel color="gray.500">Certificates Earned</StatLabel>
                <StatNumber color="teal.500">{user?.certificatesEarned || 2}</StatNumber>
                <StatHelpText>Achievements</StatHelpText>
              </Stat>
              
              <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm">
                <StatLabel color="gray.500">Points Earned</StatLabel>
                <StatNumber color="teal.500">{userRank?.points || 850}</StatNumber>
                <StatHelpText>Community Contribution</StatHelpText>
              </Stat>
            </SimpleGrid>
            
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" mt={6}>
              <Text fontWeight="bold" fontSize="lg" mb={4}>Activity Summary</Text>
              <SimpleGrid columns={[1, 2]} spacing={6}>
                <Box>
                  <Text fontWeight="medium" mb={2}>Learning Streak</Text>
                  <Flex align="center">
                    <Icon as={FiCheckCircle} color="green.500" mr={2} />
                    <Text>14 days continuous learning</Text>
                  </Flex>
                </Box>
                
                <Box>
                  <Text fontWeight="medium" mb={2}>Recent Activity</Text>
                  <Flex align="center">
                    <Icon as={FiBook} color="blue.500" mr={2} />
                    <Text>Completed "Python Basics" module</Text>
                  </Flex>
                </Box>
              </SimpleGrid>
            </Box>
          </TabPanel>
          
          {/* Courses Tab */}
          <TabPanel>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" fontSize="lg" mb={4}>My Courses</Text>
              <VStack spacing={4} align="stretch">
                {courses.map(course => (
                  <Box key={course.id} p={4} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="medium">{course.name}</Text>
                      {course.certificate && (
                        <Badge colorScheme="green">
                          <Flex align="center">
                            <Icon as={FiAward} mr={1} />
                            Certified
                          </Flex>
                        </Badge>
                      )}
                    </Flex>
                    <Flex align="center">
                      <Progress 
                        value={course.progress} 
                        colorScheme="teal" 
                        size="sm" 
                        flex="1" 
                        mr={4} 
                        borderRadius="full"
                      />
                      <Text fontSize="sm" fontWeight="medium" color={course.progress === 100 ? "green.500" : "gray.600"}>
                        {course.progress}%
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          </TabPanel>
          
          {/* Achievements Tab */}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {achievements.map(achievement => (
                <Box 
                  key={achievement.id} 
                  bg="white" 
                  p={5} 
                  borderRadius="lg" 
                  boxShadow="sm"
                  position="relative"
                  overflow="hidden"
                >
                  <Box 
                    position="absolute" 
                    top="-10px" 
                    right="-10px" 
                    bg="teal.100" 
                    opacity="0.5" 
                    borderRadius="full" 
                    w="60px" 
                    h="60px" 
                  />
                  <Flex align="center" mb={3}>
                    <Icon as={achievement.icon} boxSize={6} color="teal.500" mr={3} />
                    <Text fontWeight="bold">{achievement.name}</Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.600">{achievement.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
          
          {/* Leaderboard Tab */}
          <TabPanel>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" fontSize="lg" mb={4}>CampusConnect Leaderboard</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Rank</Th>
                    <Th>User</Th>
                    <Th isNumeric>Points</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leaderboard.map(entry => (
                    <Tr 
                      key={entry.id}
                      bg={user && entry.name === user.username ? "teal.50" : undefined}
                      fontWeight={user && entry.name === user.username ? "bold" : undefined}
                    >
                      <Td>{entry.rank}</Td>
                      <Td>
                        <Flex align="center">
                          <Avatar size="sm" name={entry.name} src={entry.avatar} mr={2} />
                          <Text>{entry.name}</Text>
                        </Flex>
                      </Td>
                      <Td isNumeric>{entry.points}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Logout Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to logout from your account?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmLogout}>
              Logout
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
