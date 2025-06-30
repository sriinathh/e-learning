import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Avatar,
  IconButton,
  Divider,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5001';
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get('/api/community');
      setCommunities(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to access the community',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch communities',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  // Join community
  const handleJoinCommunity = async (communityId) => {
    try {
      setLoading(true);
      await axios.post(`/api/community/${communityId}/join`);
      toast({
        title: 'Success',
        description: 'Joined community successfully',
        status: 'success',
        duration: 3000,
      });
      fetchCommunities();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to join communities',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to join community',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Leave community
  const handleLeaveCommunity = async (communityId) => {
    try {
      setLoading(true);
      await axios.post(`/api/community/${communityId}/leave`);
      toast({
        title: 'Success',
        description: 'Left community successfully',
        status: 'success',
        duration: 3000,
      });
      fetchCommunities();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to leave communities',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to leave community',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const handleCreatePost = async (communityId) => {
    if (!newPost.trim()) {
      toast({
        title: 'Error',
        description: 'Post content cannot be empty',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/community/${communityId}/posts`, { content: newPost });
      setNewPost('');
      toast({
        title: 'Success',
        description: 'Post created successfully',
        status: 'success',
        duration: 3000,
      });
      fetchCommunities();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to create posts',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create post',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async (communityId, postId) => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment content cannot be empty',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/community/${communityId}/posts/${postId}/comments`, {
        content: newComment,
      });
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully',
        status: 'success',
        duration: 3000,
      });
      fetchCommunities();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to add comments',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to add comment',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle like
  const handleToggleLike = async (communityId, postId) => {
    try {
      setLoading(true);
      await axios.post(`/api/community/${communityId}/posts/${postId}/like`);
      fetchCommunities();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to like posts',
          status: 'error',
          duration: 3000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to toggle like',
          status: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to access the community',
        status: 'warning',
        duration: 3000,
      });
      navigate('/login');
      return;
    }
    fetchCommunities();
  }, []);

  if (initialLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        {communities.map((community) => (
          <Card key={community._id} variant="outline">
            <CardHeader>
              <HStack justify="space-between">
                <VStack align="start">
                  <Heading size="md">{community.title}</Heading>
                  <Text color="gray.500">{community.description}</Text>
                  <Badge colorScheme="blue">{community.category}</Badge>
                </VStack>
                <Button
                  colorScheme={community.members.includes(localStorage.getItem('userId')) ? 'red' : 'blue'}
                  onClick={() =>
                    community.members.includes(localStorage.getItem('userId'))
                      ? handleLeaveCommunity(community._id)
                      : handleJoinCommunity(community._id)
                  }
                  isLoading={loading}
                >
                  {community.members.includes(localStorage.getItem('userId'))
                    ? 'Leave'
                    : 'Join'}
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {community.posts.map((post) => (
                  <Box key={post._id} p={4} borderWidth={1} borderRadius="md">
                    <HStack justify="space-between">
                      <HStack>
                        <Avatar size="sm" name={post.author.name} />
                        <Text fontWeight="bold">{post.author.name}</Text>
                      </HStack>
                      <Text color="gray.500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <Text mt={2}>{post.content}</Text>
                    <HStack mt={2} spacing={4}>
                      <IconButton
                        icon={post.likes.includes(localStorage.getItem('userId')) ? <FaHeart /> : <FaRegHeart />}
                        colorScheme={post.likes.includes(localStorage.getItem('userId')) ? 'red' : 'gray'}
                        onClick={() => handleToggleLike(community._id, post._id)}
                        aria-label="Like post"
                      />
                      <Text>{post.likes.length} likes</Text>
                      <IconButton
                        icon={<FaComment />}
                        aria-label="Comment"
                        onClick={() => setSelectedCommunity(community._id)}
                      />
                      <Text>{post.comments.length} comments</Text>
                    </HStack>
                    {selectedCommunity === community._id && (
                      <VStack mt={4} align="stretch">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                        />
                        <Button
                          colorScheme="blue"
                          onClick={() => handleAddComment(community._id, post._id)}
                          isLoading={loading}
                        >
                          Comment
                        </Button>
                        <VStack align="stretch" mt={2}>
                          {post.comments.map((comment) => (
                            <Box key={comment._id} p={2} bg="gray.50" borderRadius="md">
                              <HStack>
                                <Avatar size="xs" name={comment.author.name} />
                                <Text fontWeight="bold">{comment.author.name}</Text>
                              </HStack>
                              <Text mt={1}>{comment.content}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </VStack>
                    )}
                  </Box>
                ))}
                {community.members.includes(localStorage.getItem('userId')) && (
                  <Box>
                    <Textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Write a post..."
                    />
                    <Button
                      mt={2}
                      colorScheme="blue"
                      onClick={() => handleCreatePost(community._id)}
                      isLoading={loading}
                    >
                      Post
                    </Button>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default Community; 