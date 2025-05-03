const express = require("express");
const router = express.Router();
const Community = require("../models/Community");
const CommunityMessage = require("../models/CommunityMessage");
const DirectMessage = require("../models/DirectMessage");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/community");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all communities
router.get("/", verifyToken, async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("createdBy", "name email profilePicture")
      .select("-members");
    
    res.json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Failed to fetch communities" });
  }
});

// Create a new community
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Community name is required" });
    }
    
    const newCommunity = new Community({
      name,
      description: description || "",
      createdBy: req.userId,
      members: [{
        user: req.userId,
        role: 'admin'
      }],
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags || []
    });
    
    await newCommunity.save();
    
    // Populate creator info for the response
    await newCommunity.populate("createdBy", "name email profilePicture");
    
    res.status(201).json(newCommunity);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Failed to create community" });
  }
});

// Get community details with members
router.get("/:communityId", verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
      .populate("createdBy", "name email profilePicture")
      .populate("members.user", "name email profilePicture lastActive");
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Add online status to members
    const membersWithStatus = community.members.map(member => {
      const isOnline = member.user.lastActive && 
        (new Date() - new Date(member.user.lastActive)) < 15 * 60 * 1000;
      
      return {
        _id: member.user._id,
        name: member.user.name,
        email: member.user.email,
        profilePicture: member.user.profilePicture,
        role: member.role,
        joinedAt: member.joinedAt,
        isOnline: isOnline || member.user._id.toString() === req.userId
      };
    });
    
    const communityWithMemberStatus = {
      ...community.toObject(),
      members: membersWithStatus,
      isMember: community.members.some(member => member.user._id.toString() === req.userId)
    };
    
    res.json(communityWithMemberStatus);
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ message: "Failed to fetch community" });
  }
});

// Join a community
router.post("/:communityId/join", verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is already a member
    if (community.members.some(member => member.user.toString() === req.userId)) {
      return res.status(400).json({ message: "You are already a member of this community" });
    }
    
    // Add user to community members
    community.members.push({
      user: req.userId,
      role: 'member',
      joinedAt: new Date()
    });
    
    await community.save();
    
    res.json({ message: "Successfully joined the community" });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Failed to join community" });
  }
});

// Leave a community
router.post("/:communityId/leave", verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member
    const memberIndex = community.members.findIndex(
      member => member.user.toString() === req.userId
    );
    
    if (memberIndex === -1) {
      return res.status(400).json({ message: "You are not a member of this community" });
    }
    
    // Creator cannot leave their own community if they're the only admin
    if (community.createdBy.toString() === req.userId) {
      const hasOtherAdmins = community.members.some(
        member => member.role === 'admin' && member.user.toString() !== req.userId
      );
      
      if (!hasOtherAdmins) {
        return res.status(400).json({ 
          message: "As the only admin, you cannot leave. Make someone else an admin first or delete the community." 
        });
      }
    }
    
    // Remove user from community members
    community.members.splice(memberIndex, 1);
    await community.save();
    
    res.json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: "Failed to leave community" });
  }
});

// Get community messages
router.get("/:communityId/messages", verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member (only members can see messages)
    const isMember = community.members.some(
      member => member.user.toString() === req.userId
    );
    
    if (!isMember && !community.isPublic) {
      return res.status(403).json({ message: "You must be a member to view messages" });
    }
    
    // Add pagination
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await CommunityMessage.find({ community: req.params.communityId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender", "name profilePicture");
    
    // Format messages for client
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        profilePicture: msg.sender.profilePicture
      },
      attachments: msg.attachments || [],
      reactions: msg.reactions || [],
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      isEdited: msg.isEdited,
      isCurrentUser: msg.sender._id.toString() === req.userId
    }));
    
    res.json({
      messages: formattedMessages.reverse(), // Reverse to get oldest first
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error("Error fetching community messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send a message to a community
router.post("/:communityId/messages", verifyToken, upload.array('attachments', 5), async (req, res) => {
  try {
    const { content } = req.body;
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member (only members can send messages)
    const isMember = community.members.some(
      member => member.user.toString() === req.userId
    );
    
    if (!isMember) {
      return res.status(403).json({ message: "You must be a member to send messages" });
    }
    
    if ((!content || content.trim() === "") && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "Message content or attachments are required" });
    }
    
    // Process attachments if any
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'file';
        attachments.push({
          type: fileType,
          url: `/uploads/community/${file.filename}`,
          name: file.originalname,
          size: file.size
        });
      }
    }
    
    const newMessage = new CommunityMessage({
      content: content || "",
      sender: req.userId,
      community: req.params.communityId,
      attachments
    });
    
    await newMessage.save();
    
    // Populate sender info
    await newMessage.populate("sender", "name profilePicture");
    
    // Format for client
    const formattedMessage = {
      _id: newMessage._id,
      content: newMessage.content,
      sender: {
        _id: newMessage.sender._id,
        name: newMessage.sender.name,
        profilePicture: newMessage.sender.profilePicture
      },
      attachments: newMessage.attachments,
      reactions: [],
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      isEdited: false,
      isCurrentUser: true
    };
    
    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get direct messages between two users
router.get("/direct/:userId", verifyToken, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    // Validate the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add pagination
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 50;
    
    // Get messages between the two users (in both directions)
    const messages = await DirectMessage.find({
      $or: [
        { sender: req.userId, recipient: otherUserId },
        { sender: otherUserId, recipient: req.userId }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender", "name profilePicture")
      .populate("recipient", "name profilePicture");
    
    // Format messages for client
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        profilePicture: msg.sender.profilePicture
      },
      recipient: {
        _id: msg.recipient._id,
        name: msg.recipient.name,
        profilePicture: msg.recipient.profilePicture
      },
      attachments: msg.attachments || [],
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      isEdited: msg.isEdited,
      read: msg.read,
      isCurrentUser: msg.sender._id.toString() === req.userId
    }));
    
    res.json({
      messages: formattedMessages.reverse(), // Reverse to get oldest first
      hasMore: messages.length === limit
    });
    
    // Mark received messages as read
    await DirectMessage.updateMany(
      { sender: otherUserId, recipient: req.userId, read: false },
      { read: true }
    );
  } catch (error) {
    console.error("Error fetching direct messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send a direct message to another user
router.post("/direct/:userId", verifyToken, upload.array('attachments', 5), async (req, res) => {
  try {
    const { content } = req.body;
    const recipientId = req.params.userId;
    
    // Validate the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if ((!content || content.trim() === "") && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "Message content or attachments are required" });
    }
    
    // Process attachments if any
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'file';
        attachments.push({
          type: fileType,
          url: `/uploads/community/${file.filename}`,
          name: file.originalname,
          size: file.size
        });
      }
    }
    
    const newMessage = new DirectMessage({
      content: content || "",
      sender: req.userId,
      recipient: recipientId,
      attachments
    });
    
    await newMessage.save();
    
    // Populate sender and recipient info
    await newMessage.populate("sender", "name profilePicture");
    await newMessage.populate("recipient", "name profilePicture");
    
    // Format for client
    const formattedMessage = {
      _id: newMessage._id,
      content: newMessage.content,
      sender: {
        _id: newMessage.sender._id,
        name: newMessage.sender.name,
        profilePicture: newMessage.sender.profilePicture
      },
      recipient: {
        _id: newMessage.recipient._id,
        name: newMessage.recipient.name,
        profilePicture: newMessage.recipient.profilePicture
      },
      attachments: newMessage.attachments,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      isEdited: false,
      read: false,
      isCurrentUser: true
    };
    
    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("Error sending direct message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get all active users (for contacts)
router.get("/users/active", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "name email profilePicture lastActive");
    
    // Add online status
    const activeUsers = users.map(user => {
      const isOnline = user.lastActive && 
        (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000;
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isOnline: isOnline || user._id.toString() === req.userId,
        isCurrentUser: user._id.toString() === req.userId
      };
    });
    
    res.json(activeUsers);
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update community info
router.put("/:communityId", verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Only creator or admins can update community
    const member = community.members.find(
      member => member.user.toString() === req.userId
    );
    
    if (!member || (member.role !== 'admin' && community.createdBy.toString() !== req.userId)) {
      return res.status(403).json({ message: "Only community admins can update community info" });
    }
    
    if (name) community.name = name;
    if (description !== undefined) community.description = description;
    if (isPublic !== undefined) community.isPublic = isPublic;
    if (tags) community.tags = tags;
    
    await community.save();
    
    res.json(community);
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Failed to update community" });
  }
});

// Delete community
router.delete("/:communityId", verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Only creator can delete community
    if (community.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only community creator can delete community" });
    }
    
    // Delete all related messages
    await CommunityMessage.deleteMany({ community: req.params.communityId });
    
    // Delete the community
    await Community.findByIdAndDelete(req.params.communityId);
    
    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: "Failed to delete community" });
  }
});

module.exports = router; 