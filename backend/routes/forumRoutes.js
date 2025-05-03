const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost, 
  votePost, 
  addComment, 
  voteComment, 
  addReply 
} = require('../controllers/forum/forumController');
const { protect } = require('../middleware/authMiddleware');

// Forum post routes
router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(protect, getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Voting on posts
router.route('/:id/vote')
  .post(protect, votePost);

// Comments
router.route('/:id/comments')
  .post(protect, addComment);

// Vote on comment
router.route('/:id/comments/:commentId/vote')
  .post(protect, voteComment);

// Reply to comment
router.route('/:id/comments/:commentId/replies')
  .post(protect, addReply);

module.exports = router; 