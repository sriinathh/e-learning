// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "", // optional default for profile picture
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['online', 'away', 'offline', 'busy'],
    default: 'online'
  },
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  }],
  directMessageContacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  coursesEnrolled: {
    type: Number,
    default: 0
  },
  certificatesEarned: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", userSchema);
