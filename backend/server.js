// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const http = require("http");
const socketIo = require("socket.io");

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");
const campusConnectRoutes = require("./routes/campusConnectRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const materialRoutes = require("./routes/materialRoutes");
const eventRoutes = require("./routes/eventRoutes");
const forumRoutes = require("./routes/forumRoutes");
const communityRoutes = require("./routes/communityRoutes");
const simpleCourseRoutes = require("./routes/simpleCourseRoutes");

// Models
const User = require("./models/User");
const Community = require("./models/Community");

// Set a default JWT_SECRET if none is provided in the .env file
process.env.JWT_SECRET = process.env.JWT_SECRET || "educonnect_secure_jwt_secret";

// Add default NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, replace with specific origins
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
// Increase payload size limit for base64 images to handle larger files
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Setup multer for file upload (for profile pictures)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePics"); // Path to store uploaded profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/educonnect";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chat", campusConnectRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/simple-course", simpleCourseRoutes);

// Health check endpoint for frontend to verify server connection
app.get("/api/health-check", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io
// Keep track of online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  // Handle user login
  socket.on("login", async (userId) => {
    // Associate socket ID with user ID
    onlineUsers.set(socket.id, userId);
    
    // Update user's online status
    try {
      await User.findByIdAndUpdate(userId, {
        lastActive: new Date(),
        status: 'online'
      });
      
      // Broadcast to all users that this user is online
      io.emit("userStatusChange", { userId, status: 'online' });
      
      // Get user's communities
      const user = await User.findById(userId).populate('communities');
      if (user && user.communities) {
        // Join socket rooms for each community
        user.communities.forEach(community => {
          socket.join(`community:${community._id}`);
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });
  
  // Handle user logout or disconnect
  const handleDisconnect = async () => {
    const userId = onlineUsers.get(socket.id);
    
    if (userId) {
      try {
        // Update user's online status
        await User.findByIdAndUpdate(userId, {
          lastActive: new Date(),
          status: 'offline'
        });
        
        // Broadcast to all users that this user is offline
        io.emit("userStatusChange", { userId, status: 'offline' });
        
        // Remove from onlineUsers
        onlineUsers.delete(socket.id);
      } catch (error) {
        console.error("Error updating user status on disconnect:", error);
      }
    }
    
    console.log("Client disconnected:", socket.id);
  };
  
  socket.on("logout", handleDisconnect);
  socket.on("disconnect", handleDisconnect);
  
  // Handle join community
  socket.on("joinCommunity", (communityId) => {
    socket.join(`community:${communityId}`);
  });
  
  // Handle leave community
  socket.on("leaveCommunity", (communityId) => {
    socket.leave(`community:${communityId}`);
  });
  
  // Handle new community message
  socket.on("sendCommunityMessage", (message) => {
    io.to(`community:${message.community}`).emit("newCommunityMessage", message);
  });
  
  // Handle direct message
  socket.on("sendDirectMessage", (message) => {
    // Find recipient's socket ID
    let recipientSocketId = null;
    for (const [socketId, userId] of onlineUsers.entries()) {
      if (userId === message.recipient) {
        recipientSocketId = socketId;
        break;
      }
    }
    
    // Send message to recipient if online
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newDirectMessage", message);
    }
    
    // Also send to sender for confirmation
    socket.emit("newDirectMessage", message);
  });
  
  // Handle typing indicator
  socket.on("typing", (data) => {
    if (data.communityId) {
      // Community chat typing
      socket.to(`community:${data.communityId}`).emit("userTyping", {
        userId: data.userId,
        communityId: data.communityId,
        isTyping: data.isTyping
      });
    } else if (data.recipientId) {
      // Direct message typing
      // Find recipient's socket ID
      let recipientSocketId = null;
      for (const [socketId, userId] of onlineUsers.entries()) {
        if (userId === data.recipientId) {
          recipientSocketId = socketId;
          break;
        }
      }
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("userTyping", {
          userId: data.userId,
          isTyping: data.isTyping
        });
      }
    }
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ 
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
