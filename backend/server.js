// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

// Import routes
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");

// Models
const User = require("./models/User");

// Set a default JWT_SECRET if none is provided in the .env file
process.env.JWT_SECRET = process.env.JWT_SECRET || "educonnect_secure_jwt_secret";
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/educonnect";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Routes
app.use("/api/users", userRoutes);      // /api/users/login, /register etc.
app.use("/api/auth", userRoutes);       // /api/auth/login, /register (alias)
app.use("/api/community", communityRoutes);

// Health Check Route
app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Socket.io for user status & community joining
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("login", async (userId) => {
    onlineUsers.set(socket.id, userId);

    try {
      await User.findByIdAndUpdate(userId, {
        lastActive: new Date(),
        status: 'online'
      });

      io.emit("userStatusChange", { userId, status: 'online' });

      const user = await User.findById(userId).populate('communities');
      if (user && user.communities) {
        user.communities.forEach(community => {
          socket.join(`community:${community._id}`);
        });
      }
    } catch (error) {
      console.error("Socket Login Error:", error);
    }
  });

  socket.on("disconnect", async () => {
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          lastActive: new Date(),
          status: 'offline'
        });

        io.emit("userStatusChange", { userId, status: 'offline' });
        onlineUsers.delete(socket.id);
      } catch (error) {
        console.error("Socket Disconnect Error:", error);
      }
    }

    console.log("🔌 Client disconnected:", socket.id);
  });
});

// 404 Not Found
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❗ Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
