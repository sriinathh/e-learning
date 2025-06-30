const Community = require('../models/Community');
const User = require('../models/User');

// Create a new community
exports.createCommunity = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const community = new Community({
      title,
      description,
      category,
      createdBy: req.user._id,
      members: [req.user._id]
    });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all communities
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single community
exports.getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .populate('posts.author', 'name email')
      .populate('posts.comments.author', 'name email');
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    community.members.push(req.user._id);
    await community.save();
    res.json({ message: 'Joined community successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a community
exports.leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not a member of this community' });
    }

    community.members = community.members.filter(
      member => member.toString() !== req.user._id.toString()
    );
    await community.save();
    res.json({ message: 'Left community successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a post in community
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be a member to post' });
    }

    community.posts.push({
      content,
      author: req.user._id
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { communityId, postId } = req.params;
    
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const post = community.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      content,
      author: req.user._id
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const { communityId, postId } = req.params;
    const community = await Community.findById(communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const post = community.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 