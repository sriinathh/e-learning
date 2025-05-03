const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Your User model

const router = express.Router();

// Setup multer to handle file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilePics'); // Path to store uploaded profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Route to handle profile picture upload
router.post('/upload-profile-pic/:userId', upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save the image path to the user's profile
    user.profilePic = `/uploads/profilePics/${req.file.filename}`;
    await user.save();

    res.json(user); // Return updated user with the profile picture URL
  } catch (err) {
    console.log('Error uploading profile pic:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
