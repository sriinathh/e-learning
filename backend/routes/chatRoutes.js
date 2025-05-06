const express = require("express");
const router = express.Router();
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

// Get all messages
router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find()
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
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/messages", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }
    
    const newMessage = new Message({
      content,
      sender: req.userId
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

// Get online users
router.get("/users", verifyToken, async (req, res) => {
  try {
    // In a real app, you'd track online status with WebSockets
    // For demo, just return all users
    const users = await User.find({}, "username profilePic lastLogin");
    
    // Format for client, add fake online status
    const formattedUsers = users.map(user => {
      // Set as online if logged in within the last 15 minutes
      const isOnline = user.lastLogin && 
        (new Date() - new Date(user.lastLogin)) < 15 * 60 * 1000;
      
      return {
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        isOnline: isOnline || user._id.toString() === req.userId
      };
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router; 