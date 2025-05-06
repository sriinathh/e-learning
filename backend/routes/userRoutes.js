const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { uploadBase64Image } = require("../utils/cloudinary");
const mongoose = require("mongoose");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log(`User found, validating password for: ${user.username}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Valid login - generate token
    console.log(`Login successful for: ${user.username}`);
    
    // Update last login timestamp
    await User.findByIdAndUpdate(user._id, { 
      lastLogin: new Date(),
      status: 'online' 
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      _id: user._id, // Include _id explicitly for frontend consistency
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.joinedAt || user.createdAt || new Date()
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get Profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Profile
router.post("/update-profile", async (req, res) => {
  try {
    const { userId, username, email, profilePic } = req.body;
    
    // Log the incoming user ID for debugging
    console.log("Update profile request received. User ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Invalid ObjectId format: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find user first to check if they exist
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`User not found with ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${user.username}, ${user.email}`);

    // Create update object based on what fields were provided
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Handle profile picture
    if (profilePic) {
      try {
        // Store the profile picture URL directly
        updateData.profilePic = profilePic;
        updateData.profilePicture = profilePic; // For backward compatibility
        updateData.avatar = profilePic; // For backward compatibility
      } catch (imgError) {
        console.error("Image processing error:", imgError);
        return res.status(400).json({ message: "Invalid image data" });
      }
    }

    // Update the user with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      console.log("User update failed - no user returned from update operation");
      return res.status(404).json({ message: "User update failed" });
    }

    // Update successful
    console.log("User profile updated successfully:", updatedUser._id);
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      message: "Server error: " + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
