import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
  HStack,
  Badge,
  Image,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useColorModeValue,
  Avatar,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  AvatarBadge,
  IconButton,
  Stack,
  Link
} from '@chakra-ui/react';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUser, 
  FaClock, 
  FaUsers, 
  FaPlusCircle,
  FaMedal,
  FaCode,
  FaGraduationCap,
  FaBullhorn,
  FaCalendarCheck,
  FaTrash,
  FaEdit,
  FaImage,
  FaChevronDown,
  FaFilter,
  FaSearch,
  FaFileAlt,
  FaUniversity,
  FaSort,
  FaEye,
  FaLink,
  FaCamera
} from 'react-icons/fa';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventsPage = () => {
  // Update the currentUser initialization to get data from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if user data exists in localStorage (from login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Parse the stored user data
        const userData = JSON.parse(storedUser);
        return {
          id: userData._id || userData.id || '123',
          name: userData.name || 'User',
          email: userData.email || 'user@example.com',
          // Use profile picture if available, otherwise fall back to avatar
          avatar: userData.profilePicture || userData.avatar || getDefaultAvatar(userData.name || 'User'),
          role: userData.role || 'student',
          hasCustomAvatar: !!userData.profilePicture
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Fallback to default user if no data in localStorage
    return {
      id: '123',
      name: 'Current User',
      email: 'user@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
      role: 'student',
      hasCustomAvatar: false
    };
  });

  // Helper function to get a default avatar using the new API
  const getDefaultAvatar = (name) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  // Add state for profile picture upload
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const { isOpen: isProfileModalOpen, onOpen: openProfileModal, onClose: closeProfileModal } = useDisclosure();

  // Add a useEffect to load user data when the component mounts
  const toast = useToast();
  useEffect(() => {
    // This would typically be a call to your authentication API
    // For now, we'll simulate it with localStorage
    const fetchCurrentUser = () => {
      try {
        // Check if the user is logged in via localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          setCurrentUser({
            id: userData._id || userData.id || '123',
            name: userData.name || 'User',
            email: userData.email || 'user@example.com',
            // Use profile picture if available, otherwise fall back to avatar
            avatar: userData.profilePicture || userData.avatar || getDefaultAvatar(userData.name || 'User'),
            role: userData.role || 'student',
            hasCustomAvatar: !!userData.profilePicture
          });
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast({
          title: 'Error',
          description: 'Could not retrieve user information',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    fetchCurrentUser();
  }, []);

  // Function to handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProfileUploading(true);
    
    // In a real app, you would upload to a server or cloud storage
    // For this demo, we'll use a local FileReader to create a preview
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
      setIsProfileUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to process the image',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setIsProfileUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Function to save profile picture
  const saveProfilePicture = () => {
    if (!profileImagePreview) {
      toast({
        title: 'Error',
        description: 'Please upload an image first',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      // Get current user data
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Update with new profile picture
      userData.profilePicture = profileImagePreview;
      userData.hasCustomAvatar = true;
      
      // Save back to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update current user state
      setCurrentUser({
        ...currentUser,
        avatar: profileImagePreview,
        hasCustomAvatar: true
      });
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      closeProfileModal();
    } catch (error) {
      console.error('Error saving profile picture:', error);
      toast({
        title: 'Error',
        description: 'Could not save profile picture',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Sample events data - in a real app, this would come from an API
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Annual Tech Symposium',
      description: 'Join us for the annual technology symposium featuring keynote speakers from leading tech companies.',
      category: 'event',
      date: '2023-05-15',
      location: 'Main Auditorium',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      creator: {
        id: '123',
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    },
    {
      id: '2',
      title: 'CodeFest Hackathon',
      description: '24-hour coding competition. Build innovative solutions to real-world problems.',
      category: 'hackathon',
      date: '2023-06-10',
      location: 'CS Department',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
      creator: {
        id: '124',
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      }
    },
    {
      id: '3',
      title: 'Campus Placement Drive',
      description: 'Top companies will be visiting for campus recruitment. Register now!',
      category: 'promotion',
      date: '2023-07-05',
      location: 'Placement Office',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      creator: {
        id: '125',
        name: 'Robert Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      }
    },
    {
      id: '4',
      title: 'Semester Examination Schedule',
      description: 'Final examination schedule for the current semester has been released.',
      category: 'announcement',
      date: '2023-05-01',
      location: 'Online',
      imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop',
      creator: {
        id: '126',
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
      }
    },
    {
      id: '5',
      title: 'Library Hours Update',
      description: 'Library hours have been extended during the examination period.',
      category: 'circular',
      date: '2023-04-28',
      location: 'Library',
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2076&auto=format&fit=crop',
      creator: {
        id: '127',
        name: 'Michael Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
      }
    },
    {
      id: '6',
      title: 'AI Workshop Series',
      description: 'A series of workshops on artificial intelligence and machine learning applications.',
      category: 'event',
      date: '2023-06-15',
      location: 'Room 101, CS Building',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
      creator: {
        id: '128',
        name: 'Sarah Thompson',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
      }
    }
  ]);

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'event',
    date: '',
    location: '',
    imageUrl: ''
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerColor = useColorModeValue('blue.50', 'blue.900');
  
  const categories = [
    { value: 'all', label: 'All Events', icon: FaCalendarAlt, color: 'blue' },
    { value: 'event', label: 'Campus Events', icon: FaUsers, color: 'green' },
    { value: 'hackathon', label: 'Hackathons', icon: FaCode, color: 'purple' },
    { value: 'promotion', label: 'Promotions', icon: FaBullhorn, color: 'orange' },
    { value: 'announcement', label: 'Announcements', icon: FaBullhorn, color: 'red' },
    { value: 'circular', label: 'Circulars', icon: FaFileAlt, color: 'teal' }
  ];
  
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    filterEvents();
  }, [activeCategory, searchQuery, sortBy, events]);
  
  const filterEvents = () => {
    let filtered = [...events];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => event.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort events
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    setFilteredEvents(filtered);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Filter events by selected date
    const dateStr = date.toISOString().split('T')[0];
    const eventsOnDate = events.filter(event => event.date === dateStr);
    
    setFilteredEvents(eventsOnDate);
    setActiveCategory('all');
    setSearchQuery('');
  };
  
  const handleFormChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // In a real app, you would upload to a server or cloud storage
    // For this demo, we'll use a local FileReader to create a preview
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagePreview(reader.result);
      // Set the image URL in the form
      setEventForm({
        ...eventForm,
        imageUrl: reader.result
      });
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to process the image',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!eventForm.title || !eventForm.description || !eventForm.category || !eventForm.date || !eventForm.location) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    // In a real app, this would be an API call
    const newEvent = {
      id: (events.length + 1).toString(),
      ...eventForm,
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        hasCustomAvatar: currentUser.hasCustomAvatar
      }
    };
    
    // Add new event to the list
    setEvents([newEvent, ...events]);
    
    toast({
      title: 'Success',
      description: 'Event created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    
    // Reset form and close modal
    setEventForm({
      title: '',
      description: '',
      category: 'event',
      date: '',
      location: '',
      imageUrl: ''
    });
    
    onClose();
  };
  
  const handleDeleteEvent = (id) => {
    // In a real app, this would be an API call
    setEvents(events.filter(event => event.id !== id));
    
    toast({
      title: 'Event Deleted',
      description: 'The event has been successfully deleted',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };
  
  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : FaCalendarAlt;
  };
  
  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'blue';
  };
  
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const hasEvents = events.some(event => event.date === dateStr);
    
    return hasEvents ? (
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          height: '8px',
          width: '8px',
          borderRadius: '50%',
          backgroundColor: 'blue'
        }}
      />
    ) : null;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Box minH="100vh" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Hero Section */}
      <Box
        bg="blue.600"
        color="white"
        py={12}
        px={4}
        backgroundImage="url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
        borderRadius="lg"
        mx={4}
        mb={12}
      >
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          bg="blue.900" 
          opacity={0.8} 
          borderRadius="lg"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
              <Heading size="2xl">Campus Event Manager</Heading>
              <Text fontSize="xl" maxW="lg">
                Stay updated with all campus events, announcements, and activities. Never miss an important event again!
              </Text>
              <HStack spacing={4}>
                <Button 
                  leftIcon={<FaPlusCircle />} 
                  colorScheme="white" 
                  variant="outline"
                  size="lg"
                  onClick={onOpen}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Create New Event
                </Button>
                <Button 
                  leftIcon={<FaCamera />} 
                  colorScheme="green" 
                  variant="solid"
                  size="lg"
                  onClick={openProfileModal}
                >
                  Update Profile Picture
                </Button>
              </HStack>
            </VStack>
            
            <Box position="relative">
              <Avatar 
                size="2xl" 
                name={currentUser.name} 
                src={currentUser.avatar}
                border="4px solid white" 
                boxShadow="xl"
              />
              {currentUser.hasCustomAvatar && (
                <Badge 
                  position="absolute" 
                  bottom="-2px" 
                  right="-2px" 
                  colorScheme="green" 
                  fontSize="0.8em"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  Custom
                </Badge>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: 'column', lg: 'row' }} 
          gap={8}
        >
          {/* Left Sidebar with Calendar and Filters */}
          <Box 
            w={{ base: 'full', lg: '300px' }} 
            bg={bgColor} 
            p={4} 
            borderRadius="lg" 
            boxShadow="md"
            height="fit-content"
          >
            <VStack spacing={6} align="stretch">
              <Calendar 
                onChange={handleDateChange} 
                value={selectedDate}
                tileContent={tileContent}
              />
              
              <Divider />
              
              <Box>
                <Heading size="md" mb={4}>Categories</Heading>
                <VStack align="stretch" spacing={2}>
                  {categories.map(category => (
                    <Button
                      key={category.value}
                      leftIcon={<Icon as={category.icon} />}
                      variant={activeCategory === category.value ? 'solid' : 'ghost'}
                      colorScheme={category.color}
                      justifyContent="flex-start"
                      onClick={() => setActiveCategory(category.value)}
                      size="sm"
                    >
                      {category.label}
                    </Button>
                  ))}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="md" mb={4}>Sort By</Heading>
                <Select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  size="sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </Select>
              </Box>
            </VStack>
          </Box>
          
          {/* Main Content Area */}
          <Box flex={1}>
            {/* Search Bar */}
            <InputGroup mb={6}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search events, announcements, etc."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                bg={bgColor}
                size="lg"
              />
            </InputGroup>
            
            {/* Events Grid */}
            <Heading 
              size="lg" 
              mb={6} 
              display="flex" 
              alignItems="center"
            >
              <Icon 
                as={getCategoryIcon(activeCategory)} 
                mr={2} 
                color={`${getCategoryColor(activeCategory)}.500`} 
              />
              {categories.find(c => c.value === activeCategory)?.label || 'All Events'}
              <Badge ml={2} colorScheme="blue" borderRadius="full" px={2}>
                {filteredEvents.length}
              </Badge>
            </Heading>
            
            {filteredEvents.length === 0 ? (
              <Box textAlign="center" py={10} bg={bgColor} borderRadius="lg">
                <Icon as={FaCalendarAlt} boxSize={10} color="gray.400" mb={4} />
                <Heading size="md" color="gray.500" mb={2}>No events found</Heading>
                <Text color="gray.500">
                  {activeCategory === 'all' 
                    ? 'There are no events for your search criteria.' 
                    : `There are no ${activeCategory} events available.`}
                </Text>
                <Button mt={4} colorScheme="blue" onClick={onOpen}>
                  Create a New Event
                </Button>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    overflow="hidden" 
                    variant="outline" 
                    bg={bgColor}
                    boxShadow="sm"
                    _hover={{ boxShadow: 'md', transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                    height="100%"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Box position="relative">
                      <Image
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'}
                        alt={event.title}
                        h="200px"
                        w="100%"
                        objectFit="cover"
                      />
                      <Badge 
                        position="absolute" 
                        top={2} 
                        right={2} 
                        colorScheme={getCategoryColor(event.category)}
                        fontSize="0.8em"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                      
                      {/* Uploader Profile - Prominent Position */}
                      <Flex
                        position="absolute"
                        bottom={-10}
                        left={4}
                        align="center"
                        bg={bgColor}
                        borderRadius="full"
                        p="2px"
                        borderWidth="3px"
                        borderColor="white"
                        boxShadow="lg"
                      >
                        <Avatar
                          size="lg"
                          name={event.creator.name}
                          src={event.creator.avatar}
                          loading="eager"
                        >
                          {event.creator.hasCustomAvatar && (
                            <AvatarBadge boxSize="1.25em" bg="green.500" borderWidth="2px" />
                          )}
                        </Avatar>
                      </Flex>
                    </Box>
                    
                    <CardHeader pb={0} pt={10}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="blue.500" fontWeight="medium">
                          Posted by {event.creator.name}
                        </Text>
                        <Heading size="md" noOfLines={2} mt={1}>{event.title}</Heading>
                      </VStack>
                    </CardHeader>
                    
                    <CardBody py={2}>
                      <VStack align="start" spacing={3}>
                        <Text noOfLines={3} color="gray.600" fontSize="sm">
                          {event.description}
                        </Text>
                        
                        <HStack spacing={4} mt={2}>
                          <HStack>
                            <Icon as={FaCalendarAlt} color="gray.500" />
                            <Text color="gray.500" fontSize="sm">{formatDate(event.date)}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                            <Text color="gray.500" fontSize="sm" noOfLines={1}>{event.location}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </CardBody>
                    
                    <Divider />
                    
                    <CardFooter pt={2}>
                      <Flex width="100%" justify="flex-end" align="center">
                        {currentUser.id === event.creator.id && (
                          <HStack>
                            <IconButton
                              icon={<FaTrash />}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              aria-label="Delete event"
                              onClick={() => handleDeleteEvent(event.id)}
                            />
                            <IconButton
                              icon={<FaEdit />}
                              colorScheme="blue"
                              variant="ghost"
                              size="sm"
                              aria-label="Edit event"
                            />
                          </HStack>
                        )}
                      </Flex>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Flex>
      </Container>
      
      {/* Create Event Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg={headerColor} borderTopRadius="md">Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Creator Preview */}
            <Box mb={6} p={6} borderWidth="1px" borderRadius="lg" bg="blue.50" boxShadow="sm">
              <Heading size="md" mb={4} color="blue.700">My Profile</Heading>
              <Flex direction={{ base: 'column', sm: 'row' }} align="center">
                <Box 
                  position="relative" 
                  mr={{ base: 0, sm: 6 }} 
                  mb={{ base: 4, sm: 0 }} 
                  borderRadius="full" 
                  borderWidth="3px" 
                  borderColor="blue.400"
                  boxShadow="lg"
                >
                  <Avatar 
                    size="2xl" 
                    name={currentUser.name} 
                    src={currentUser.avatar}
                    loading="eager"
                  >
                    {currentUser.hasCustomAvatar && (
                      <AvatarBadge 
                        boxSize="1.5em" 
                        bg="green.500" 
                        borderWidth="3px" 
                        borderColor="white"
                      >
                        <Icon as={FaUser} color="white" boxSize={3} />
                      </AvatarBadge>
                    )}
                  </Avatar>
                </Box>
                
                <VStack align={{ base: 'center', sm: 'flex-start' }} spacing={2}>
                  <Heading size="lg" color="blue.700">{currentUser.name}</Heading>
                  <HStack>
                    <Icon as={FaUser} color="gray.500" />
                    <Text fontSize="md" color="gray.600">{currentUser.email}</Text>
                  </HStack>
                  <HStack mt={1}>
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                      {currentUser.role}
                    </Badge>
                    {currentUser.hasCustomAvatar ? (
                      <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                        Custom Avatar
                      </Badge>
                    ) : (
                      <Badge colorScheme="orange" fontSize="md" px={3} py={1} borderRadius="full">
                        Default Avatar
                      </Badge>
                    )}
                  </HStack>
                  <Button 
                    mt={2} 
                    leftIcon={<FaCamera />} 
                    colorScheme="blue" 
                    size="sm"
                    onClick={() => {
                      onClose(); // Close event modal
                      openProfileModal(); // Open profile update modal
                    }}
                  >
                    Update Profile Picture
                  </Button>
                </VStack>
              </Flex>
            </Box>
          
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input 
                  name="title"
                  value={eventForm.title}
                  onChange={handleFormChange}
                  placeholder="Enter a title for your event"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select 
                  name="category"
                  value={eventForm.category}
                  onChange={handleFormChange}
                >
                  {categories.filter(c => c.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description"
                  value={eventForm.description}
                  onChange={handleFormChange}
                  placeholder="Describe your event"
                  rows={4}
                />
              </FormControl>
              
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input 
                    name="date"
                    type="date"
                    value={eventForm.date}
                    onChange={handleFormChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    name="location"
                    value={eventForm.location}
                    onChange={handleFormChange}
                    placeholder="Event location"
                  />
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Event Image</FormLabel>
                <VStack spacing={3} align="stretch">
                  {imagePreview ? (
                    <Box 
                      position="relative" 
                      borderRadius="md" 
                      overflow="hidden"
                      height="200px"
                      width="100%"
                    >
                      <Image 
                        src={imagePreview} 
                        alt="Event preview" 
                        width="100%" 
                        height="100%" 
                        objectFit="cover"
                      />
                      <IconButton 
                        position="absolute" 
                        top={2}
                        right={2}
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => {
                          setImagePreview('');
                          setEventForm({
                            ...eventForm,
                            imageUrl: ''
                          });
                        }}
                        aria-label="Remove image"
                      />
                    </Box>
                  ) : (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                      px={4}
                      borderWidth={2}
                      borderRadius="md"
                      borderStyle="dashed"
                      borderColor="gray.300"
                      bg="gray.50"
                      cursor="pointer"
                      onClick={() => document.getElementById('event-image-upload').click()}
                      _hover={{ bg: 'gray.100' }}
                    >
                      <Icon as={FaImage} w={10} h={10} color="gray.400" mb={3} />
                      <Text color="gray.500" mb={2}>Click to upload an image</Text>
                      <Text fontSize="xs" color="gray.400">Recommended: 1200 x 600 pixels</Text>
                      
                      {isUploading && (
                        <Text mt={2} fontSize="sm" color="blue.500" fontWeight="medium">
                          Processing image...
                        </Text>
                      )}
                    </Flex>
                  )}
                  
                  <Input
                    id="event-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    display="none"
                  />
                  
                  <HStack>
                    <Button
                      leftIcon={<FaImage />}
                      onClick={() => document.getElementById('event-image-upload').click()}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      width="50%"
                    >
                      Upload Image
                    </Button>
                    
                    <InputGroup size="sm" width="50%">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaLink} color="gray.500" />
                      </InputLeftElement>
                      <Input 
                        name="imageUrl"
                        value={eventForm.imageUrl}
                        onChange={handleFormChange}
                        placeholder="Or enter image URL"
                        disabled={!!imagePreview}
                      />
                    </InputGroup>
                  </HStack>
                </VStack>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Profile Picture Upload Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={closeProfileModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg={headerColor} borderTopRadius="md">Update Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5}>
              <Box width="100%" textAlign="center">
                <Avatar 
                  size="2xl" 
                  name={currentUser.name} 
                  src={profileImagePreview || currentUser.avatar} 
                  mb={4} 
                  border="4px solid"
                  borderColor="blue.400"
                />
                <Text fontWeight="bold" fontSize="lg" mt={2}>{currentUser.name}</Text>
                <Text color="gray.500">{currentUser.email}</Text>
              </Box>
              
              {profileImagePreview ? (
                <HStack spacing={4} width="100%" justify="center">
                  <Button 
                    leftIcon={<FaTrash />} 
                    colorScheme="red"
                    onClick={() => setProfileImagePreview('')}
                  >
                    Remove
                  </Button>
                  <Button 
                    leftIcon={<FaImage />} 
                    colorScheme="blue"
                    onClick={() => document.getElementById('profile-image-upload').click()}
                  >
                    Choose Another
                  </Button>
                </HStack>
              ) : (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={8}
                  px={4}
                  borderWidth={2}
                  borderRadius="md"
                  borderStyle="dashed"
                  borderColor="gray.300"
                  bg="gray.50"
                  cursor="pointer"
                  onClick={() => document.getElementById('profile-image-upload').click()}
                  _hover={{ bg: 'gray.100' }}
                  width="100%"
                >
                  <Icon as={FaImage} w={10} h={10} color="gray.400" mb={3} />
                  <Text color="gray.500" mb={2}>Click to upload a profile picture</Text>
                  <Text fontSize="xs" color="gray.400">Recommended: Square image (1:1 ratio)</Text>
                  
                  {isProfileUploading && (
                    <Text mt={2} fontSize="sm" color="blue.500" fontWeight="medium">
                      Processing image...
                    </Text>
                  )}
                </Flex>
              )}
              
              <Input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                display="none"
              />
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeProfileModal}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={saveProfilePicture}
              isDisabled={!profileImagePreview}
            >
              Save Profile Picture
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <style jsx="true" global="true">{`
        .campus-calendar {
          width: 100% !important;
          border: none !important;
          border-radius: 8px;
          overflow: hidden;
        }
        .react-calendar__tile {
          position: relative;
          height: 44px;
        }
        .react-calendar__tile--active {
          background: #3182ce !important;
          color: white;
        }
        .react-calendar__tile--now {
          background: #bee3f8;
        }
      `}</style>
    </Box>
  );
};

export default EventsPage; 