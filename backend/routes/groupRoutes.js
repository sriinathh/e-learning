const express = require("express");
const router = express.Router();
const ChatGroup = require("../models/ChatGroup");
const User = require("../models/User");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

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

// Get all groups
router.get("/", verifyToken, async (req, res) => {
  try {
    const groups = await ChatGroup.find()
      .populate("createdBy", "username profilePic")
      .select("-members");
    
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// Create a new group
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Group name is required" });
    }
    
    const newGroup = new ChatGroup({
      name,
      description: description || "",
      createdBy: req.userId,
      members: [req.userId], // Creator is automatically a member
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await newGroup.save();
    
    // Populate creator info for the response
    await newGroup.populate("createdBy", "username profilePic");
    
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Failed to create group" });
  }
});

// Get group details with members
router.get("/:groupId", verifyToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId)
      .populate("createdBy", "username profilePic")
      .populate("members", "username profilePic lastLogin");
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Add online status to members (for demo purposes)
    const membersWithStatus = group.members.map(member => {
      const isOnline = member.lastLogin && 
        (new Date() - new Date(member.lastLogin)) < 15 * 60 * 1000;
      
      return {
        _id: member._id,
        username: member.username,
        profilePic: member.profilePic,
        isOnline: isOnline || member._id.toString() === req.userId
      };
    });
    
    const groupWithMemberStatus = {
      ...group.toObject(),
      members: membersWithStatus,
      isMember: group.members.some(member => member._id.toString() === req.userId)
    };
    
    res.json(groupWithMemberStatus);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Failed to fetch group" });
  }
});

// Join a group
router.post("/:groupId/join", verifyToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user is already a member
    if (group.members.includes(req.userId)) {
      return res.status(400).json({ message: "You are already a member of this group" });
    }
    
    // Add user to group members
    group.members.push(req.userId);
    await group.save();
    
    res.json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Failed to join group" });
  }
});

// Leave a group
router.post("/:groupId/leave", verifyToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.userId)) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }
    
    // Creator cannot leave their own group
    if (group.createdBy.toString() === req.userId) {
      return res.status(400).json({ message: "Group creator cannot leave. Delete the group instead." });
    }
    
    // Remove user from group members
    group.members = group.members.filter(
      memberId => memberId.toString() !== req.userId
    );
    await group.save();
    
    res.json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Failed to leave group" });
  }
});

// Get group messages
router.get("/:groupId/messages", verifyToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user is a member (only members can see messages)
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: "You must be a member to view messages" });
    }
    
    const messages = await Message.find({ group: req.params.groupId })
      .sort({ createdAt: 1 })
      .populate("sender", "username profilePic");
    
    // Format messages for client
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      sender: {
        username: msg.sender.username,
        _id: msg.sender._id,
        profilePic: msg.sender.profilePic
      },
      createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      isCurrentUser: msg.sender._id.toString() === req.userId
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send message to group
router.post("/:groupId/messages", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const group = await ChatGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user is a member (only members can send messages)
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: "You must be a member to send messages" });
    }
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }
    
    const newMessage = new Message({
      content,
      sender: req.userId,
      group: req.params.groupId
    });
    
    await newMessage.save();
    
    // Populate sender info
    await newMessage.populate("sender", "username profilePic");
    
    // Format for client
    const formattedMessage = {
      id: newMessage._id,
      content: newMessage.content,
      sender: {
        username: newMessage.sender.username,
        _id: newMessage.sender._id,
        profilePic: newMessage.sender.profilePic
      },
      createdAt: new Date(newMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      isCurrentUser: true
    };
    
    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Delete a group (creator only)
router.delete("/:groupId", verifyToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user is the creator
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the group creator can delete this group" });
    }
    
    // Delete all messages in the group
    await Message.deleteMany({ group: req.params.groupId });
    
    // Delete the group
    await ChatGroup.findByIdAndDelete(req.params.groupId);
    
    res.json({ message: "Group successfully deleted" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Failed to delete group" });
  }
});

module.exports = router; 