import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
  useToast,
  VStack,
  HStack,
  Tag,
  Textarea,
  Avatar,
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
  Link,
  IconButton,
  Stack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaTag,
  FaPaperclip,
  FaFilter,
  FaSearch,
  FaPlus,
  FaReply,
  FaThumbsUp,
  FaThumbsDown,
  FaHeart,
  FaShare,
  FaUserCircle,
  FaCalendarAlt,
  FaCode,
  FaDatabase,
  FaLaptopCode,
  FaNetworkWired
} from 'react-icons/fa';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [filter, setFilter] = useState({
    subject: '',
    tag: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostForm, setNewPostForm] = useState({
    title: '',
    content: '',
    subject: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const subjects = ['Programming', 'Data Structures', 'Algorithms', 'Networking', 'Database Systems', 'Machine Learning'];
  const popularTags = ['homework', 'exam', 'project', 'help', 'resources', 'discussion', 'question'];
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  useEffect(() => {
    if (posts.length > 0) {
      applyFilters();
    }
  }, [filter, searchQuery, posts]);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/forum');
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load forum posts',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
    setLoading(false);
  };
  
  const fetchPostDetails = async (postId) => {
    try {
      const res = await axios.get(`/api/forum/${postId}`);
      setSelectedPost(res.data.data);
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load post details',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const applyFilters = () => {
    let filtered = [...posts];
    
    if (filter.subject) {
      filtered = filtered.filter(post => post.subject === filter.subject);
    }
    
    if (filter.tag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(filter.tag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(filtered);
  };
  
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePostFormChange = (e) => {
    setNewPostForm({
      ...newPostForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddTag = () => {
    if (newTag && !newPostForm.tags.includes(newTag)) {
      setNewPostForm({
        ...newPostForm,
        tags: [...newPostForm.tags, newTag]
      });
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag) => {
    setNewPostForm({
      ...newPostForm,
      tags: newPostForm.tags.filter(t => t !== tag)
    });
  };
  
  const handleCreatePost = async () => {
    if (!newPostForm.title || !newPostForm.content || !newPostForm.subject) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      const res = await axios.post('/api/forum', newPostForm);
      
      setPosts([res.data.data, ...posts]);
      setFilteredPosts([res.data.data, ...filteredPosts]);
      
      toast({
        title: 'Success',
        description: 'Post created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      setNewPostForm({
        title: '',
        content: '',
        subject: '',
        tags: []
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const handleVotePost = async (postId, voteType) => {
    try {
      const res = await axios.post(`/api/forum/${postId}/vote`, { voteType });
      
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(res.data.data);
      }
      
      // Update the post in the lists
      const updatedPost = res.data.data;
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
      setFilteredPosts(filteredPosts.map(post => post._id === postId ? updatedPost : post));
      
      toast({
        title: 'Success',
        description: 'Vote recorded successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error voting on post:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost) {
      return;
    }
    
    try {
      const res = await axios.post(`/api/forum/${selectedPost._id}/comments`, {
        content: commentText
      });
      
      setSelectedPost(res.data.data);
      setCommentText('');
      
      toast({
        title: 'Success',
        description: 'Comment added successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const handleVoteComment = async (commentId, voteType) => {
    if (!selectedPost) return;
    
    try {
      const res = await axios.post(`/api/forum/${selectedPost._id}/comments/${commentId}/vote`, {
        voteType
      });
      
      setSelectedPost(res.data.data);
      
      toast({
        title: 'Success',
        description: 'Vote recorded successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error voting on comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const handleAddReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText || !replyText.trim() || !selectedPost) {
      return;
    }
    
    try {
      const res = await axios.post(`/api/forum/${selectedPost._id}/comments/${commentId}/replies`, {
        content: replyText
      });
      
      setSelectedPost(res.data.data);
      setReplyTexts({
        ...replyTexts,
        [commentId]: ''
      });
      
      toast({
        title: 'Success',
        description: 'Reply added successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'Programming':
        return FaCode;
      case 'Data Structures':
        return FaNetworkWired;
      case 'Algorithms':
        return FaLaptopCode;
      case 'Database Systems':
        return FaDatabase;
      default:
        return FaCode;
    }
  };
  
  const getVoteStatus = (item, userId = 'temp-user-id') => {
    if (item.upvotes && item.upvotes.includes(userId)) {
      return 'upvoted';
    } else if (item.downvotes && item.downvotes.includes(userId)) {
      return 'downvoted';
    }
    return 'none';
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={6}>Community Forum</Heading>
      
      <Flex mb={6} wrap="wrap" gap={4}>
        <Flex flex={1} minW={{ base: '100%', md: 'auto' }}>
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            flex={1}
          />
          <IconButton
            aria-label="Search"
            icon={<FaSearch />}
            ml={2}
          />
        </Flex>
        
        <HStack spacing={4}>
          <Select
            placeholder="All Subjects"
            name="subject"
            value={filter.subject}
            onChange={handleFilterChange}
            minW="150px"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </Select>
          
          <Select
            placeholder="All Tags"
            name="tag"
            value={filter.tag}
            onChange={handleFilterChange}
            minW="150px"
          >
            {popularTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </Select>
          
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
            New Post
          </Button>
        </HStack>
      </Flex>
      
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        {/* Posts List */}
        <Box 
          flex={1} 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden" 
          bg={bgColor}
          borderColor={borderColor}
          height="fit-content"
        >
          <Heading size="md" p={4} borderBottomWidth="1px" borderColor={borderColor}>
            Discussions
          </Heading>
          
          {loading ? (
            <Text p={4} textAlign="center">Loading discussions...</Text>
          ) : filteredPosts.length === 0 ? (
            <Text p={4} textAlign="center">No discussions found.</Text>
          ) : (
            <VStack spacing={0} align="stretch" divider={<Divider />}>
              {filteredPosts.map(post => (
                <Box 
                  key={post._id} 
                  p={4} 
                  _hover={{ bg: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => fetchPostDetails(post._id)}
                >
                  <Flex>
                    <VStack align="center" minW="60px" mr={4}>
                      <IconButton
                        icon={<FaArrowUp />}
                        aria-label="Upvote"
                        size="sm"
                        colorScheme={getVoteStatus(post) === 'upvoted' ? 'blue' : 'gray'}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVotePost(post._id, getVoteStatus(post) === 'upvoted' ? 'none' : 'upvote');
                        }}
                      />
                      <Text fontWeight="bold">
                        {(post.upvotes ? post.upvotes.length : 0) - (post.downvotes ? post.downvotes.length : 0)}
                      </Text>
                      <IconButton
                        icon={<FaArrowDown />}
                        aria-label="Downvote"
                        size="sm"
                        colorScheme={getVoteStatus(post) === 'downvoted' ? 'red' : 'gray'}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVotePost(post._id, getVoteStatus(post) === 'downvoted' ? 'none' : 'downvote');
                        }}
                      />
                    </VStack>
                    
                    <Box flex={1}>
                      <Flex justify="space-between" align="flex-start">
                        <Heading size="md" mb={2}>{post.title}</Heading>
                        <Badge colorScheme="blue" py={1} px={2} borderRadius="md">
                          <Icon as={getSubjectIcon(post.subject)} mr={1} />
                          {post.subject}
                        </Badge>
                      </Flex>
                      
                      <Text noOfLines={2} mb={3} color="gray.600">{post.content}</Text>
                      
                      <Flex justify="space-between" align="center">
                        <HStack>
                          {post.tags && post.tags.map(tag => (
                            <Tag key={tag} size="sm" colorScheme="blue" variant="outline">
                              #{tag}
                            </Tag>
                          ))}
                        </HStack>
                        
                        <HStack spacing={4} color="gray.500" fontSize="sm">
                          <Flex align="center">
                            <Icon as={FaComment} mr={1} />
                            <Text>{post.comments ? post.comments.length : 0}</Text>
                          </Flex>
                          
                          <Flex align="center">
                            <Icon as={FaCalendarAlt} mr={1} />
                            <Text>{formatDate(post.createdAt)}</Text>
                          </Flex>
                        </HStack>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
        
        {/* Selected Post Details */}
        {selectedPost ? (
          <Box 
            flex={2} 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            bg={bgColor}
            borderColor={borderColor}
          >
            <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
              <Flex justify="space-between" mb={4}>
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  <Icon as={getSubjectIcon(selectedPost.subject)} mr={1} />
                  {selectedPost.subject}
                </Badge>
                
                <HStack>
                  {selectedPost.tags && selectedPost.tags.map(tag => (
                    <Tag key={tag} colorScheme="blue" variant="outline">
                      #{tag}
                    </Tag>
                  ))}
                </HStack>
              </Flex>
              
              <Heading size="lg" mb={4}>{selectedPost.title}</Heading>
              
              <Flex justify="space-between" align="center" mb={6}>
                <HStack>
                  <Avatar size="sm" name={selectedPost.author?.name} src="" />
                  <Text fontWeight="bold">{selectedPost.author?.name || 'User'}</Text>
                </HStack>
                
                <Text color="gray.500" fontSize="sm">
                  Posted on {formatDate(selectedPost.createdAt)}
                </Text>
              </Flex>
              
              <Text whiteSpace="pre-wrap" mb={6}>{selectedPost.content}</Text>
              
              <Flex justify="space-between">
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FaThumbsUp />}
                    colorScheme={getVoteStatus(selectedPost) === 'upvoted' ? 'blue' : 'gray'}
                    variant="outline"
                    size="sm"
                    onClick={() => handleVotePost(
                      selectedPost._id,
                      getVoteStatus(selectedPost) === 'upvoted' ? 'none' : 'upvote'
                    )}
                  >
                    {selectedPost.upvotes ? selectedPost.upvotes.length : 0}
                  </Button>
                  <Button
                    leftIcon={<FaThumbsDown />}
                    colorScheme={getVoteStatus(selectedPost) === 'downvoted' ? 'red' : 'gray'}
                    variant="outline"
                    size="sm"
                    onClick={() => handleVotePost(
                      selectedPost._id,
                      getVoteStatus(selectedPost) === 'downvoted' ? 'none' : 'downvote'
                    )}
                  >
                    {selectedPost.downvotes ? selectedPost.downvotes.length : 0}
                  </Button>
                </HStack>
                
                <HStack>
                  <IconButton
                    icon={<FaShare />}
                    aria-label="Share"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: 'Link Copied',
                        description: 'Post link copied to clipboard',
                        status: 'info',
                        duration: 2000,
                        isClosable: true
                      });
                    }}
                  />
                </HStack>
              </Flex>
            </Box>
            
            {/* Comments Section */}
            <Box p={6}>
              <Heading size="md" mb={4}>
                {selectedPost.comments ? selectedPost.comments.length : 0} Comments
              </Heading>
              
              <VStack spacing={6} align="stretch" mb={6}>
                {selectedPost.comments && selectedPost.comments.map(comment => (
                  <Box key={comment._id} pl={4} borderLeftWidth="2px" borderColor="blue.200">
                    <Flex mb={2}>
                      <Avatar size="sm" mr={2} name={comment.author?.name} src="" />
                      <Box>
                        <Text fontWeight="bold">{comment.author?.name || 'User'}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(comment.createdAt)}
                        </Text>
                      </Box>
                    </Flex>
                    
                    <Text mb={3}>{comment.content}</Text>
                    
                    <Flex justify="space-between" mb={4}>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<FaThumbsUp />}
                          aria-label="Upvote"
                          size="xs"
                          colorScheme={getVoteStatus(comment) === 'upvoted' ? 'blue' : 'gray'}
                          variant="ghost"
                          onClick={() => handleVoteComment(
                            comment._id,
                            getVoteStatus(comment) === 'upvoted' ? 'none' : 'upvote'
                          )}
                        />
                        <Text fontSize="sm">
                          {(comment.upvotes ? comment.upvotes.length : 0) - (comment.downvotes ? comment.downvotes.length : 0)}
                        </Text>
                        <IconButton
                          icon={<FaThumbsDown />}
                          aria-label="Downvote"
                          size="xs"
                          colorScheme={getVoteStatus(comment) === 'downvoted' ? 'red' : 'gray'}
                          variant="ghost"
                          onClick={() => handleVoteComment(
                            comment._id,
                            getVoteStatus(comment) === 'downvoted' ? 'none' : 'downvote'
                          )}
                        />
                      </HStack>
                      
                      <Link 
                        color="blue.500" 
                        fontSize="sm"
                        onClick={() => {
                          const updatedReplyTexts = { ...replyTexts };
                          updatedReplyTexts[comment._id] = updatedReplyTexts[comment._id] || '';
                          setReplyTexts(updatedReplyTexts);
                        }}
                      >
                        <Icon as={FaReply} mr={1} />
                        Reply
                      </Link>
                    </Flex>
                    
                    {/* Reply Form */}
                    {replyTexts[comment._id] !== undefined && (
                      <Box mb={4} pl={4}>
                        <Textarea
                          placeholder="Write a reply..."
                          size="sm"
                          mb={2}
                          value={replyTexts[comment._id] || ''}
                          onChange={(e) => setReplyTexts({
                            ...replyTexts,
                            [comment._id]: e.target.value
                          })}
                        />
                        <Flex justify="flex-end">
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleAddReply(comment._id)}
                            isDisabled={!replyTexts[comment._id]}
                          >
                            Post Reply
                          </Button>
                        </Flex>
                      </Box>
                    )}
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box pl={4} mt={2}>
                        <Text fontWeight="semibold" mb={2} fontSize="sm">
                          {comment.replies.length} Replies
                        </Text>
                        
                        <VStack spacing={3} align="stretch">
                          {comment.replies.map((reply, index) => (
                            <Box key={index} pl={2} borderLeftWidth="1px" borderColor="gray.200">
                              <Flex mb={1}>
                                <Avatar size="xs" mr={2} name={reply.author?.name} src="" />
                                <Box>
                                  <Text fontWeight="bold" fontSize="sm">{reply.author?.name || 'User'}</Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {formatDate(reply.createdAt)}
                                  </Text>
                                </Box>
                              </Flex>
                              <Text fontSize="sm">{reply.content}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
              
              {/* Add Comment */}
              <Box>
                <Heading size="sm" mb={3}>Add a Comment</Heading>
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  mb={3}
                />
                <Flex justify="flex-end">
                  <Button
                    colorScheme="blue"
                    onClick={handleAddComment}
                    isDisabled={!commentText.trim()}
                  >
                    Post Comment
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box 
            flex={2} 
            borderWidth="1px" 
            borderRadius="lg" 
            p={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            bg={bgColor}
            borderColor={borderColor}
          >
            <Icon as={FaComment} boxSize={12} color="blue.200" mb={4} />
            <Heading size="md" mb={2}>Select a Discussion</Heading>
            <Text color="gray.500">
              Click on a discussion from the list to view its details and join the conversation
            </Text>
          </Box>
        )}
      </Flex>
      
      {/* Create Post Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Discussion</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title"
                  value={newPostForm.title}
                  onChange={handlePostFormChange}
                  placeholder="Enter a descriptive title"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea 
                  name="content"
                  value={newPostForm.content}
                  onChange={handlePostFormChange}
                  placeholder="Describe your question or topic in detail"
                  rows={6}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Select 
                  name="subject"
                  value={newPostForm.subject}
                  onChange={handlePostFormChange}
                  placeholder="Select subject"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Flex mb={2}>
                  <Input 
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    flex={1}
                  />
                  <Button 
                    ml={2} 
                    onClick={handleAddTag}
                    isDisabled={!newTag || newPostForm.tags.includes(newTag)}
                  >
                    Add
                  </Button>
                </Flex>
                <Box>
                  <Text mb={2} fontSize="sm" color="gray.600">
                    Popular tags: {popularTags.join(', ')}
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {newPostForm.tags.map(tag => (
                      <Tag 
                        key={tag} 
                        colorScheme="blue" 
                        size="md"
                      >
                        #{tag}
                        <Button
                          size="xs"
                          ml={1}
                          onClick={() => handleRemoveTag(tag)}
                          variant="unstyled"
                        >
                          ×
                        </Button>
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost}>
              Create Post
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ForumPage; 