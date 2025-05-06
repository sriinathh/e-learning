// File: /src/components/SupportForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Icon,
  Flex,
  useToast
} from '@chakra-ui/react';
import { FaHeadset, FaClipboardCheck, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    year: '',
    queryType: 'resume-review',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle radio input changes
  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    // Submit form data (in a real app, this would go to an API)
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: 'Request Submitted',
      description: 'We have received your support request and will get back to you soon.',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      studentId: '',
      department: '',
      year: '',
      queryType: 'resume-review',
      message: '',
      preferredDate: '',
      preferredTime: ''
    });
    
    setSubmitted(true);
  };
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Placement Support</Heading>
        <Text color="gray.600">
          Need help with your placement journey? Our placement team is here to support you.
          Fill out the form below for assistance.
        </Text>
        
        {submitted && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            p={6}
            mb={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Request Submitted!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Thank you for reaching out. A placement coordinator will contact you within 24-48 hours.
            </AlertDescription>
            <Button 
              mt={4} 
              colorScheme="green" 
              onClick={() => setSubmitted(false)}
            >
              Submit Another Request
            </Button>
          </Alert>
        )}
        
        {!submitted && (
          <Box as="form" onSubmit={handleSubmit} borderWidth="1px" borderRadius="lg" p={6} bg="white">
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    name="email"
                    value={formData.email}
                    type="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </FormControl>
              </HStack>
              
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Student ID</FormLabel>
                  <Input 
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Department</FormLabel>
                  <Select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Select department"
                  >
                    <option value="cse">Computer Science Engineering</option>
                    <option value="ece">Electronics & Communication</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="chemical">Chemical Engineering</option>
                    <option value="business">Business Administration</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Select 
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Select year"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="pg">Post Graduate</option>
                  </Select>
                </FormControl>
              </HStack>
              
              <Divider my={2} />
              
              <FormControl as="fieldset">
                <FormLabel as="legend">Request Type</FormLabel>
                <RadioGroup
                  value={formData.queryType}
                  onChange={(value) => handleRadioChange('queryType', value)}
                >
                  <HStack spacing={6} wrap="wrap">
                    <Radio value="resume-review">
                      <HStack>
                        <Icon as={FaClipboardCheck} color="blue.500" />
                        <Text>Resume Review</Text>
                      </HStack>
                    </Radio>
                    <Radio value="mock-interview">
                      <HStack>
                        <Icon as={FaUsers} color="purple.500" />
                        <Text>Mock Interview</Text>
                      </HStack>
                    </Radio>
                    <Radio value="placement-guidance">
                      <HStack>
                        <Icon as={FaHeadset} color="green.500" />
                        <Text>Placement Guidance</Text>
                      </HStack>
                    </Radio>
                    <Radio value="schedule-appointment">
                      <HStack>
                        <Icon as={FaCalendarAlt} color="orange.500" />
                        <Text>Schedule Appointment</Text>
                      </HStack>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              
              {formData.queryType === 'schedule-appointment' && (
                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Preferred Date</FormLabel>
                    <Input 
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select 
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      placeholder="Select time"
                    >
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 6 PM)</option>
                    </Select>
                  </FormControl>
                </HStack>
              )}
              
              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your query or request in detail"
                  rows={5}
                />
              </FormControl>
              
              <Button type="submit" colorScheme="blue" alignSelf="flex-end" mt={2}>
                Submit Request
              </Button>
            </VStack>
          </Box>
        )}
        
        <Flex
          mt={6}
          p={4}
          bg="blue.50"
          borderRadius="md"
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
        >
          <Box>
            <Heading size="sm">Need immediate assistance?</Heading>
            <Text mt={1}>Contact the Placement Office directly:</Text>
          </Box>
          <HStack mt={{ base: 4, md: 0 }} spacing={4}>
            <Button colorScheme="blue" variant="outline" size="sm">
              Email Us
            </Button>
            <Button colorScheme="green" size="sm">
              Call Placement Office
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default SupportForm;
