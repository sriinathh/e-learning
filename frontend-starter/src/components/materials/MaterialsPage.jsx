import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Icon,
  Flex,
  Badge,
  Divider,
  Input,
  HStack,
  VStack,
  useColorModeValue,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Image,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
  Progress,
  FormHelperText,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { 
  FaGraduationCap, 
  FaBook, 
  FaDownload, 
  FaSearch, 
  FaStar, 
  FaFileAlt, 
  FaVideo,
  FaFilePdf,
  FaArrowRight,
  FaUpload,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
  FaUser,
  FaClock,
  FaShare,
  FaTags,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown
} from 'react-icons/fa';
import * as materialService from '../../services/materialService';

const MaterialsPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  // Modal controls
  const { 
    isOpen: isUploadOpen, 
    onOpen: onUploadOpen, 
    onClose: onUploadClose 
  } = useDisclosure();
  
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose
  } = useDisclosure();
  
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();
  
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose
  } = useDisclosure();
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    type: "",
    sortBy: "newest"
  });
  
  // State for upload functionality
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    subject: "",
    type: "",
    file: null,
    thumbnail: null,
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  
  // State for tracking the currently selected material
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Sample data for courses (in a real app, this would come from an API)
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Data Structures and Algorithms",
      description: "Comprehensive study materials for DSA including sorting algorithms, trees, graphs and complexity analysis.",
      type: "Course Materials",
      subject: "Computer Science",
      downloads: 1245,
      rating: 4.8,
      image: "https://img.freepik.com/free-vector/gradient-technological-background_23-2148884155.jpg",
      fileUrl: "https://example.com/files/dsa_materials.pdf",
      uploadedBy: "Prof. Alan Turing",
      uploadDate: "2023-02-15",
      tags: ["algorithms", "data structures", "sorting", "graphs"],
      fileSize: "5.2 MB",
      fileType: "pdf"
    },
    {
      id: 2,
      title: "Advanced Database Systems",
      description: "Complete lecture notes covering relational and NoSQL databases, indexing, and query optimization.",
      type: "Lecture Notes",
      subject: "Software Engineering",
      downloads: 984,
      rating: 4.5,
      image: "https://img.freepik.com/free-vector/digital-technology-background-with-blue-orange-light-effect_1017-27428.jpg",
      fileUrl: "https://example.com/files/advanced_db.pdf",
      uploadedBy: "Dr. Codd",
      uploadDate: "2023-03-10",
      tags: ["database", "SQL", "NoSQL", "indexing"],
      fileSize: "3.8 MB",
      fileType: "pdf"
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML concepts including supervised and unsupervised learning algorithms.",
      type: "PDF",
      subject: "Artificial Intelligence",
      downloads: 2341,
      rating: 4.9,
      image: "https://img.freepik.com/free-vector/futuristic-background-with-glowing-lines_52683-55981.jpg",
      fileUrl: "https://example.com/files/ml_fundamentals.pdf",
      uploadedBy: "Dr. Andrew Ng",
      uploadDate: "2023-01-05",
      tags: ["machine learning", "AI", "algorithms", "neural networks"],
      fileSize: "8.1 MB",
      fileType: "pdf"
    },
    {
      id: 4,
      title: "Calculus for Engineers",
      description: "Comprehensive study guide for engineering calculus with practice problems and solutions.",
      type: "Study Guide",
      subject: "Mathematics",
      downloads: 876,
      rating: 4.3,
      image: "https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148874123.jpg",
      fileUrl: "https://example.com/files/calculus_engineers.pdf",
      uploadedBy: "Prof. Isaac Newton",
      uploadDate: "2023-04-20",
      tags: ["calculus", "mathematics", "engineering", "practice problems"],
      fileSize: "4.5 MB",
      fileType: "pdf"
    },
    {
      id: 5,
      title: "Introduction to Quantum Computing",
      description: "Explore the fundamentals of quantum computing and quantum algorithms.",
      type: "Video Lectures",
      subject: "Physics",
      downloads: 1563,
      rating: 4.7,
      image: "https://img.freepik.com/free-vector/cyber-security-concept_23-2148532223.jpg",
      fileUrl: "https://example.com/files/quantum_computing.mp4",
      uploadedBy: "Dr. Richard Feynman",
      uploadDate: "2023-05-12",
      tags: ["quantum", "physics", "computing", "algorithms"],
      fileSize: "320 MB",
      fileType: "mp4"
    },
    {
      id: 6,
      title: "Web Development with React",
      description: "Complete guide to building modern web applications using React and related technologies.",
      type: "Tutorial",
      subject: "Web Development",
      downloads: 3120,
      rating: 4.6,
      image: "https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg",
      fileUrl: "https://example.com/files/react_web_dev.zip",
      uploadedBy: "Jordan Walke",
      uploadDate: "2023-06-01",
      tags: ["react", "javascript", "web development", "frontend"],
      fileSize: "15.3 MB",
      fileType: "zip"
    }
  ]);

  // Initialize filtered materials
  useEffect(() => {
    setFilteredMaterials(materials);
  }, [materials]);
  
  // Filter materials based on search query and filters
  useEffect(() => {
    let result = [...materials];
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(material => 
        material.title.toLowerCase().includes(query) ||
        material.description.toLowerCase().includes(query) ||
        material.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply subject filter
    if (filters.subject) {
      result = result.filter(material => material.subject === filters.subject);
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(material => material.type === filters.type);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredMaterials(result);
  }, [searchQuery, filters, materials]);
  
  // Featured materials - top 3 by downloads
  const featuredMaterials = [...materials]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  
  // Stats calculation
  const totalDownloads = materials.reduce((sum, course) => sum + course.downloads, 0);
  const averageRating = (materials.reduce((sum, course) => sum + course.rating, 0) / materials.length).toFixed(1);
  
  // Load materials from API
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        // NOTE: This is where you would call the real API in production
        // const response = await materialService.getAllMaterials();
        // setMaterials(response.data);
        
        // For now, we'll use the mock data
        console.log('Using mock materials data');
        // No action needed as materials are initialized with mock data
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: 'Error fetching materials',
          description: 'There was an error loading the study materials.',
          status: 'error',
          duration: 5000,
        });
      }
    };

    fetchMaterials();
  }, [toast]);

  // Upload functionality with real API integration
  const handleUploadMaterial = async () => {
    // Validate input
    if (!newMaterial.title || !newMaterial.description || !newMaterial.subject || !newMaterial.type || !newMaterial.file) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields and select a file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // REAL API IMPLEMENTATION (commented out for now)
      // Would call the materialService to upload the material
      /*
      await materialService.uploadMaterial(
        {
          title: newMaterial.title,
          description: newMaterial.description,
          subject: newMaterial.subject,
          fileType: newMaterial.type,
          tags: newMaterial.tags,
          file: newMaterial.file
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );
      */
      
      // Simulate upload process
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15);
        if (progress > 100) progress = 100;
        setUploadProgress(progress);
        
        if (progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Create a new material object
            const newId = materials.length + 1;
            const fileType = newMaterial.file.name.split('.').pop();
            const fileSize = (newMaterial.file.size / (1024 * 1024)).toFixed(1) + " MB";
            const today = new Date().toISOString().split('T')[0];
            
            // Get user information
            const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest User' };
            
            const addedMaterial = {
              id: newId,
              title: newMaterial.title,
              description: newMaterial.description,
              type: newMaterial.type,
              subject: newMaterial.subject,
              downloads: 0,
              rating: 0,
              image: newMaterial.thumbnail || `https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-${Math.floor(Math.random() * 20000)}.jpg`,
              fileUrl: URL.createObjectURL(newMaterial.file), // In a real app, this would be a server URL
              uploadedBy: user.name,
              uploadDate: today,
              tags: newMaterial.tags,
              fileSize,
              fileType
            };
            
            // Add to materials list
            setMaterials(prev => [addedMaterial, ...prev]);
            
            // Reset form and close modal
            setNewMaterial({
              title: "",
              description: "",
              subject: "",
              type: "",
              file: null,
              thumbnail: null,
              tags: []
            });
            setIsUploading(false);
            setUploadProgress(0);
            onUploadClose();
            
            // Show success message
            toast({
              title: "Material uploaded successfully",
              description: "Your study material is now available for others",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }, 500);
        }
      }, 300);
    } catch (error) {
      console.error('Error uploading material:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your material",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsUploading(false);
    }
  };

  // Handle material download with API integration
  const handleDownloadMaterial = (material) => {
    try {
      // REAL API IMPLEMENTATION (commented out for now)
      // Would call materialService to update download count
      // materialService.downloadMaterial(material.id);
      
      // For now, just update the local state
      setMaterials(materials.map(m => 
        m.id === material.id 
          ? {...m, downloads: m.downloads + 1} 
          : m
      ));
      
      // Create an anchor tag to simulate download
      if (material.fileUrl) {
        const link = document.createElement('a');
        link.href = material.fileUrl;
        link.setAttribute('download', `${material.title}.${material.fileType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Download started",
        description: `Downloading ${material.title}`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({
        title: "Download failed",
        description: error.message || "There was an error downloading this material",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handle material deletion with API integration
  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    
    try {
      // REAL API IMPLEMENTATION (commented out for now)
      // await materialService.deleteMaterial(selectedMaterial.id);
      
      // For now, just update local state
      setMaterials(materials.filter(m => m.id !== selectedMaterial.id));
      
      toast({
        title: "Material deleted",
        status: "success",
        duration: 3000,
      });
      
      onDeleteClose();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting this material",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handle material rating with API integration
  const handleRateMaterial = (id, rating) => {
    try {
      // REAL API IMPLEMENTATION (commented out for now)
      // await materialService.rateMaterial(id, rating);
      
      // For now, just update local state
      setMaterials(materials.map(m => 
        m.id === id 
          ? {...m, rating: parseFloat(rating)} 
          : m
      ));
      
      toast({
        title: "Rating submitted",
        description: `You rated this material ${rating}/5`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error rating material:', error);
      toast({
        title: "Rating failed",
        description: error.message || "There was an error submitting your rating",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handle search with API integration
  const handleSearch = async () => {
    try {
      // REAL API IMPLEMENTATION (commented out for now)
      // const response = await materialService.searchMaterials(searchQuery, filters);
      // setFilteredMaterials(response.data);
      
      // The search filtering is already handled in the useEffect
    } catch (error) {
      console.error('Error searching materials:', error);
      toast({
        title: "Search failed",
        description: error.message || "There was an error performing your search",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      {/* Hero Section */}
      <Box
        bg="blue.600"
        color="white"
        py={12}
        px={4}
        backgroundImage="url('https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg')"
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
              <Heading size="2xl">Campus Learning Hub</Heading>
              <Text fontSize="xl" maxW="lg">
                Access quality academic resources, lecture notes, and study materials from our comprehensive collection.
              </Text>
              <HStack spacing={4}>
                <Button 
                  rightIcon={<FaArrowRight />} 
                  colorScheme="white" 
                  variant="outline"
                  size="lg"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => document.getElementById('allMaterials').scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse All Materials
                </Button>
                <Button 
                  leftIcon={<FaUpload />} 
                  colorScheme="blue" 
                  size="lg"
                  onClick={onUploadOpen}
                >
                  Upload Material
                </Button>
                  <Button
                  leftIcon={<FaUpload />}
                     colorScheme="blue"
                    size="lg"
                    onClick={() => navigate("/video-lecture")} // Navigate to /video-lecture on button click
                   >
                    VideoLecture Material
                    </Button>
              </HStack>
            </VStack>
            
            <Icon as={FaGraduationCap} boxSize={{ base: 16, md: 24 }} />
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl">
        {/* Stats Section */}
        <Box 
          mb={12} 
          p={6} 
          borderRadius="lg" 
          bg={cardBg} 
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
        >
          <StatGroup>
            <Stat>
              <StatLabel fontSize="lg">Academic Resources</StatLabel>
              <StatNumber fontSize="4xl" color="blue.500">{materials.length}+</StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="lg">Total Downloads</StatLabel>
              <StatNumber fontSize="4xl" color="green.500">{totalDownloads.toLocaleString()}</StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="lg">Average Rating</StatLabel>
              <StatNumber fontSize="4xl" color="yellow.500">
                {averageRating} <Icon as={FaStar} boxSize={6} color="yellow.400" />
              </StatNumber>
            </Stat>
          </StatGroup>
        </Box>
        
        {/* Search Bar and Filters */}
        <Flex 
          mb={12} 
          p={4} 
          borderRadius="lg" 
          bg={cardBg} 
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
          direction={{ base: 'column', md: 'row' }}
          align="center"
          gap={4}
        >
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.500" />
            </InputLeftElement>
            <Input 
              placeholder="Search by title, description, or tags..." 
              size="lg" 
              variant="filled" 
              _placeholder={{ color: 'gray.400' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="md"
            />
          </InputGroup>
          
          <HStack spacing={2}>
            <Button 
              leftIcon={<FaFilter />} 
              colorScheme="blue" 
              variant="outline"
              onClick={onFilterOpen}
            >
              Filter
            </Button>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />} colorScheme="blue" variant="outline">
                Sort: {filters.sortBy === "newest" ? "Newest" : 
                      filters.sortBy === "oldest" ? "Oldest" : 
                      filters.sortBy === "downloads" ? "Most Downloaded" : 
                      "Highest Rated"}
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaSortAmountDown />} onClick={() => setFilters({...filters, sortBy: "newest"})}>
                  Newest
                </MenuItem>
                <MenuItem icon={<FaSortAmountUp />} onClick={() => setFilters({...filters, sortBy: "oldest"})}>
                  Oldest
                </MenuItem>
                <MenuItem icon={<FaDownload />} onClick={() => setFilters({...filters, sortBy: "downloads"})}>
                  Most Downloaded
                </MenuItem>
                <MenuItem icon={<FaStar />} onClick={() => setFilters({...filters, sortBy: "rating"})}>
                  Highest Rated
                </MenuItem>
              </MenuList>
            </Menu>
            
            <Button 
              leftIcon={<FaUpload />} 
              colorScheme="blue"
              onClick={onUploadOpen}
            >
              Upload
            </Button>
          </HStack>
        </Flex>
        
        {/* Active filters */}
        {(filters.subject || filters.type) && (
          <Flex mb={6} wrap="wrap" gap={2} align="center">
            <Text fontWeight="bold">Active Filters:</Text>
            {filters.subject && (
              <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                <TagLabel>{filters.subject}</TagLabel>
                <TagCloseButton onClick={() => setFilters({...filters, subject: ""})} />
              </Tag>
            )}
            {filters.type && (
              <Tag size="md" borderRadius="full" variant="solid" colorScheme="purple">
                <TagLabel>{filters.type}</TagLabel>
                <TagCloseButton onClick={() => setFilters({...filters, type: ""})} />
              </Tag>
            )}
            <Button size="sm" variant="link" onClick={() => setFilters({...filters, subject: "", type: ""})}>
              Clear All
            </Button>
          </Flex>
        )}
        
        {/* Filter drawer */}
        <Drawer
          isOpen={isFilterOpen}
          placement="right"
          onClose={onFilterClose}
          size="sm"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Filter Materials</DrawerHeader>
            
            <DrawerBody>
              <VStack spacing={6} align="stretch" pt={4}>
                <FormControl>
                  <FormLabel>Subject</FormLabel>
                  <Select 
                    placeholder="Select subject" 
                    value={filters.subject}
                    onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Web Development">Web Development</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Material Type</FormLabel>
                  <Select 
                    placeholder="Select type" 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="Course Materials">Course Materials</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PDF">PDF</option>
                    <option value="Study Guide">Study Guide</option>
                    <option value="Video Lectures">Video Lectures</option>
                    <option value="Tutorial">Tutorial</option>
                  </Select>
                </FormControl>
                
                <Button colorScheme="blue" onClick={onFilterClose} mt={4}>
                  Apply Filters
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        
        {/* Featured Materials */}
        <Box mb={12}>
          <Heading mb={6} size="xl" display="flex" alignItems="center">
            <Icon as={FaStar} color="yellow.400" mr={2} />
            Featured Resources
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {featuredMaterials.map(material => (
              <Card 
                key={material.id} 
                overflow="hidden" 
                variant="outline" 
                bg={cardBg}
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                height="100%"
                cursor="pointer"
                onClick={() => {
                  setSelectedMaterial(material);
                  onViewOpen();
                }}
              >
                <Box height="160px" overflow="hidden">
                  <Image 
                    src={material.image} 
                    alt={material.title}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    _hover={{ transform: "scale(1.05)", transition: "transform 0.3s ease" }}
                  />
                </Box>
                
                <CardHeader pb={0}>
                  <Flex justify="space-between" align="start">
                    <Heading size="md" noOfLines={2}>{material.title}</Heading>
                    <Badge colorScheme="blue" fontSize="0.8em" p={1} borderRadius="md">
                      {material.type}
                    </Badge>
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <Text noOfLines={3} color="gray.600">{material.description}</Text>
                  <HStack mt={4} spacing={4}>
                    <Badge colorScheme="purple">{material.subject}</Badge>
                    <Flex align="center">
                      <Icon as={FaStar} color="yellow.400" mr={1} />
                      <Text fontWeight="bold">{material.rating}</Text>
                    </Flex>
                  </HStack>
                </CardBody>
                
                <CardFooter pt={0}>
                  <Button 
                    colorScheme="blue" 
                    width="full" 
                    leftIcon={<FaDownload />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadMaterial(material);
                    }}
                  >
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* All Materials */}
        <Box mb={12} id="allMaterials">
          <Heading mb={6} size="xl" display="flex" alignItems="center">
            <Icon as={FaBook} color="blue.500" mr={2} />
            All Learning Materials
          </Heading>
          
          {filteredMaterials.length === 0 ? (
            <Center p={10} bg={cardBg} borderRadius="lg" boxShadow="sm">
              <VStack spacing={4}>
                <Icon as={FaSearch} boxSize={10} color="gray.400" />
                <Text fontSize="xl">No materials match your search criteria</Text>
                <Button 
                  colorScheme="blue"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({ subject: "", type: "", sortBy: "newest" });
                  }}
                >
                  Clear Filters
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredMaterials.map(material => (
                <Card 
                  key={material.id} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  boxShadow="sm"
                  _hover={{ 
                    boxShadow: 'md',
                    transform: 'translateY(-3px)',
                    transition: 'all 0.3s ease' 
                  }}
                >
                  <CardHeader bg="blue.50" pb={2}>
                    <Flex justify="space-between" align="center">
                      <Heading 
                        size="md" 
                        color="blue.700" 
                        noOfLines={2} 
                        cursor="pointer"
                        onClick={() => {
                          setSelectedMaterial(material);
                          onViewOpen();
                        }}
                        _hover={{ color: "blue.500" }}
                      >
                        {material.title}
                      </Heading>
                      <Tooltip label={material.fileType.toUpperCase()} placement="top">
                        <span>
                          <Icon 
                            as={material.fileType === 'pdf' ? FaFilePdf : 
                                material.fileType === 'mp4' ? FaVideo : FaFileAlt} 
                            color="blue.600" 
                            boxSize={5}
                          />
                        </span>
                      </Tooltip>
                    </Flex>
                  </CardHeader>
                  
                  <CardBody pt={3}>
                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                      {material.description}
                    </Text>
                    
                    <Flex wrap="wrap" gap={2} mb={3}>
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index} size="sm" borderRadius="full" variant="subtle" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      ))}
                      {material.tags.length > 3 && (
                        <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="gray">
                          <TagLabel>+{material.tags.length - 3} more</TagLabel>
                        </Tag>
                      )}
                    </Flex>
                    
                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                      <HStack>
                        <Icon as={FaUser} />
                        <Text>{material.uploadedBy}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaStar} color="yellow.400" />
                        <Text>{material.rating}</Text>
                      </HStack>
                    </Flex>
                  </CardBody>
                  
                  <Divider />
                  
                  <CardFooter pt={3}>
                    <Flex w="100%" justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.500">
                        <Icon as={FaDownload} mr={1} />
                        {material.downloads.toLocaleString()} downloads
                      </Text>
                      <HStack>
                        <Tooltip label="View Details">
                          <IconButton 
                            icon={<FaEye />} 
                            size="sm" 
                            variant="ghost" 
                            colorScheme="blue"
                            onClick={() => {
                              setSelectedMaterial(material);
                              onViewOpen();
                            }}
                          />
                        </Tooltip>
                        
                        <Tooltip label="Download">
                          <IconButton 
                            icon={<FaDownload />} 
                            size="sm" 
                            colorScheme="green"
                            onClick={() => {
                              handleDownloadMaterial(material);
                            }}
                          />
                        </Tooltip>
                        
                        <Tooltip label="Delete">
                          <IconButton 
                            icon={<FaTrash />} 
                            size="sm" 
                            variant="ghost" 
                            colorScheme="red"
                            onClick={() => {
                              setSelectedMaterial(material);
                              onDeleteOpen();
                            }}
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
        
        {/* Call to Action */}
        <Box 
          p={8} 
          mb={8} 
          borderRadius="lg" 
          bg="blue.600" 
          color="white"
          textAlign="center"
          bgGradient="linear(to-r, blue.600, purple.600)"
          boxShadow="xl"
        >
          <Heading size="lg" mb={4}>Ready to contribute?</Heading>
          <Text mb={6} fontSize="lg">Share your own study materials and help other students in their learning journey.</Text>
          <Button 
            colorScheme="white" 
            variant="solid" 
            size="lg"
            bg="white"
            color="blue.600"
            _hover={{ bg: "gray.100" }}
            leftIcon={<FaUpload />}
            onClick={onUploadOpen}
          >
            Upload Your Materials
          </Button>
        </Box>
      </Container>
      
      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Learning Material</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  placeholder="Enter a descriptive title" 
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Describe the content and its usefulness"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  rows={4}
                />
              </FormControl>
              
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Subject</FormLabel>
                  <Select 
                    placeholder="Select subject"
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({...newMaterial, subject: e.target.value})}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Material Type</FormLabel>
                  <Select 
                    placeholder="Select type"
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                  >
                    <option value="Course Materials">Course Materials</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PDF">PDF</option>
                    <option value="Study Guide">Study Guide</option>
                    <option value="Video Lectures">Video Lectures</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
              </HStack>
              
              <FormControl isRequired>
                <FormLabel>Tags</FormLabel>
                <HStack mb={2}>
                  <Input 
                    placeholder="Add tags (e.g., algorithms, calculus)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        if (!newMaterial.tags.includes(tagInput.trim())) {
                          setNewMaterial({
                            ...newMaterial, 
                            tags: [...newMaterial.tags, tagInput.trim()]
                          });
                        }
                        setTagInput('');
                      }
                    }}
                  />
                  <IconButton 
                    icon={<FaTags />} 
                    aria-label="Add tag"
                    onClick={() => {
                      if (tagInput.trim() && !newMaterial.tags.includes(tagInput.trim())) {
                        setNewMaterial({
                          ...newMaterial, 
                          tags: [...newMaterial.tags, tagInput.trim()]
                        });
                        setTagInput('');
                      }
                    }}
                  />
                </HStack>
                
                <Flex wrap="wrap" gap={2}>
                  {newMaterial.tags.map((tag, index) => (
                    <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton 
                        onClick={() => setNewMaterial({
                          ...newMaterial,
                          tags: newMaterial.tags.filter((_, i) => i !== index)
                        })}
                      />
                    </Tag>
                  ))}
                </Flex>
                <FormHelperText>Press Enter to add a tag</FormHelperText>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Upload File</FormLabel>
                <InputGroup>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewMaterial({...newMaterial, file});
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <Button 
                    leftIcon={<FaUpload />}
                    onClick={() => fileInputRef.current.click()}
                    width="full"
                    colorScheme={newMaterial.file ? "green" : "blue"}
                  >
                    {newMaterial.file ? `Selected: ${newMaterial.file.name}` : "Select File"}
                  </Button>
                </InputGroup>
                <FormHelperText>
                  Supported formats: PDF, DOCX, PPT, ZIP, MP4, etc. (Max size: 50MB)
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Thumbnail Image (Optional)</FormLabel>
                <Button 
                  width="full"
                  onClick={() => {
                    // In a real app, this would open a file picker for images
                    // For now, we'll just set a random image
                    const randomImage = `https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_${Math.floor(Math.random() * 1000)}.jpg`;
                    setNewMaterial({...newMaterial, thumbnail: randomImage});
                  }}
                >
                  {newMaterial.thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
                </Button>
                {newMaterial.thumbnail && (
                  <Box mt={2}>
                    <Image 
                      src={newMaterial.thumbnail} 
                      alt="Thumbnail preview" 
                      height="100px" 
                      objectFit="cover" 
                      borderRadius="md"
                    />
                  </Box>
                )}
              </FormControl>
              
              {isUploading && (
                <Box>
                  <Text mb={2}>Uploading... {uploadProgress}%</Text>
                  <Progress value={uploadProgress} size="sm" colorScheme="blue" borderRadius="md" />
                </Box>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button mr={3} onClick={onUploadClose}>Cancel</Button>
            <Button 
              colorScheme="blue" 
              isLoading={isUploading}
              loadingText="Uploading"
              onClick={handleUploadMaterial}
            >
              Upload Material
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Material View/Preview Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          {selectedMaterial && (
            <>
              <ModalHeader>{selectedMaterial.title}</ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Box borderRadius="md" overflow="hidden" height="200px">
                    <Image 
                      src={selectedMaterial.image} 
                      alt={selectedMaterial.title}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </Box>
                  
                  <HStack wrap="wrap" spacing={2}>
                    <Badge colorScheme="blue">{selectedMaterial.subject}</Badge>
                    <Badge colorScheme="purple">{selectedMaterial.type}</Badge>
                    <Badge colorScheme="green">
                      <HStack>
                        <Icon as={FaStar} />
                        <Text>{selectedMaterial.rating}</Text>
                      </HStack>
                    </Badge>
                    <Badge colorScheme="orange">
                      <HStack>
                        <Icon as={FaDownload} />
                        <Text>{selectedMaterial.downloads} downloads</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                  
                  <Box>
                    <Heading size="sm" mb={2}>Description</Heading>
                    <Text>{selectedMaterial.description}</Text>
                  </Box>
                  
                  <Divider />
                  
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <Heading size="sm" mb={2}>File Information</Heading>
                      <HStack>
                        <Icon as={selectedMaterial.fileType === 'pdf' ? FaFilePdf : 
                                selectedMaterial.fileType === 'mp4' ? FaVideo : FaFileAlt} 
                              color="blue.500" />
                        <Text>Type: {selectedMaterial.fileType.toUpperCase()}</Text>
                      </HStack>
                      <Text>Size: {selectedMaterial.fileSize}</Text>
                    </Box>
                    
                    <Box>
                      <Heading size="sm" mb={2}>Uploaded By</Heading>
                      <HStack>
                        <Icon as={FaUser} color="blue.500" />
                        <Text>{selectedMaterial.uploadedBy}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaClock} color="blue.500" />
                        <Text>On {selectedMaterial.uploadDate}</Text>
                      </HStack>
                    </Box>
                  </Grid>
                  
                  <Box>
                    <Heading size="sm" mb={2}>Tags</Heading>
                    <Flex wrap="wrap" gap={2}>
                      {selectedMaterial.tags.map((tag, index) => (
                        <Tag key={index} size="md" borderRadius="full" variant="subtle" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      ))}
                    </Flex>
                  </Box>
                </VStack>
              </ModalBody>
              
              <ModalFooter>
                <HStack spacing={3}>
                  <Button 
                    colorScheme="blue" 
                    leftIcon={<FaDownload />}
                    onClick={() => {
                      handleDownloadMaterial(selectedMaterial);
                    }}
                  >
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    leftIcon={<FaShare />}
                    onClick={() => {
                      // In a real app, this would copy a shareable link
                      navigator.clipboard.writeText(`https://educonnect.com/materials/${selectedMaterial.id}`);
                      toast({
                        title: "Link copied",
                        description: "Shareable link copied to clipboard",
                        status: "info",
                        duration: 3000,
                      });
                    }}
                  >
                    Share
                  </Button>
                  <IconButton 
                    icon={<FaStar />} 
                    aria-label="Rate material"
                    variant="outline"
                    title="Rate this material"
                    onClick={() => {
                      const newRating = (Math.random() * (5 - 4) + 4).toFixed(1);
                      handleRateMaterial(selectedMaterial.id, newRating);
                    }}
                  />
                </HStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={fileInputRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Material
            </AlertDialogHeader>
            
            <AlertDialogBody>
              Are you sure you want to delete this material? This action cannot be undone.
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={fileInputRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                ml={3}
                onClick={handleDeleteMaterial}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MaterialsPage; 