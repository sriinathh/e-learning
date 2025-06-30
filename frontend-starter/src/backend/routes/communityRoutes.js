const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const auth = require('../middleware/auth');

// Create a new community
router.post('/', auth, communityController.createCommunity);

// Get all communities
router.get('/', communityController.getAllCommunities);

// Get a single community
router.get('/:id', communityController.getCommunity);

// Join a community
router.post('/:id/join', auth, communityController.joinCommunity);

// Leave a community
router.post('/:id/leave', auth, communityController.leaveCommunity);

// Create a post in community
router.post('/:id/posts', auth, communityController.createPost);

// Add a comment to a post
router.post('/:communityId/posts/:postId/comments', auth, communityController.addComment);

// Like/Unlike a post
router.post('/:communityId/posts/:postId/like', auth, communityController.toggleLike);

module.exports = router; 