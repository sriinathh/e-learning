const ForumPost = require('../../models/ForumPost');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Private
const getPosts = async (req, res) => {
  try {
    const { subject, tag, author } = req.query;
    
    // Build filter object
    const filter = {};
    if (subject) filter.subject = subject;
    if (tag) filter.tags = tag;
    if (author) filter.author = author;
    
    const posts = await ForumPost.find(filter)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });
      
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error getting forum posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Private
const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name email')
      .populate('upvotes', 'name email')
      .populate('downvotes', 'name email')
      .populate('comments.author', 'name email')
      .populate('comments.upvotes', 'name email')
      .populate('comments.downvotes', 'name email')
      .populate('comments.replies.author', 'name email');
      
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting forum post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new forum post
// @route   POST /api/forum
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, subject, tags, attachments } = req.body;
    
    // Create post
    const post = await ForumPost.create({
      title,
      content,
      subject,
      tags: tags || [],
      attachments: attachments || [],
      author: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update forum post
// @route   PUT /api/forum/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Make sure user is the post author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }
    
    post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete forum post
// @route   DELETE /api/forum/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Make sure user is the post author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }
    
    await post.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Vote on a post (upvote/downvote)
// @route   POST /api/forum/:id/vote
// @access  Private
const votePost = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    // Validate vote type
    if (!voteType || !['upvote', 'downvote', 'none'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid vote type: upvote, downvote, or none'
      });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check existing votes
    const upvoted = post.upvotes.includes(req.user.id);
    const downvoted = post.downvotes.includes(req.user.id);
    
    // Remove existing votes
    if (upvoted) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== req.user.id);
    }
    if (downvoted) {
      post.downvotes = post.downvotes.filter(id => id.toString() !== req.user.id);
    }
    
    // Add new vote if not 'none'
    if (voteType === 'upvote') {
      post.upvotes.push(req.user.id);
    } else if (voteType === 'downvote') {
      post.downvotes.push(req.user.id);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add comment to a post
// @route   POST /api/forum/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content, attachments } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide comment content'
      });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const comment = {
      content,
      author: req.user.id,
      attachments: attachments || []
    };
    
    post.comments.push(comment);
    await post.save();
    
    const updatedPost = await ForumPost.findById(req.params.id)
      .populate('comments.author', 'name email');
    
    res.status(201).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Vote on a comment (upvote/downvote)
// @route   POST /api/forum/:id/comments/:commentId/vote
// @access  Private
const voteComment = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    // Validate vote type
    if (!voteType || !['upvote', 'downvote', 'none'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid vote type: upvote, downvote, or none'
      });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Find the comment
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check existing votes
    const upvoted = comment.upvotes.includes(req.user.id);
    const downvoted = comment.downvotes.includes(req.user.id);
    
    // Remove existing votes
    if (upvoted) {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== req.user.id);
    }
    if (downvoted) {
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== req.user.id);
    }
    
    // Add new vote if not 'none'
    if (voteType === 'upvote') {
      comment.upvotes.push(req.user.id);
    } else if (voteType === 'downvote') {
      comment.downvotes.push(req.user.id);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add reply to a comment
// @route   POST /api/forum/:id/comments/:commentId/replies
// @access  Private
const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide reply content'
      });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Find the comment
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    const reply = {
      content,
      author: req.user.id
    };
    
    comment.replies.push(reply);
    await post.save();
    
    const updatedPost = await ForumPost.findById(req.params.id)
      .populate('comments.replies.author', 'name email');
    
    res.status(201).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  votePost,
  addComment,
  voteComment,
  addReply
}; 