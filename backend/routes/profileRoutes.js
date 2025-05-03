const express = require("express");
const router = express.Router();
const {
  uploadProfilePic,
  uploadProfilePicHandler,
  serveProfilePic,
  removeProfilePic,
} = require("../controllers/profilePicController");

// Upload profile picture
router.post("/upload", uploadProfilePic, uploadProfilePicHandler);

// Serve profile picture
router.get("/view/:filename", serveProfilePic);

// Delete profile picture
router.delete("/delete", removeProfilePic);

module.exports = router;
