const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const multer = require("multer");
const path = require("path");

// Set up GridFsStorage for storing images in MongoDB
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,  // MongoDB connection URL from .env
  file: (req, file) => {
    return {
      bucketName: "profilePics",  // Name of the bucket where images will be stored
      filename: `${Date.now()}${path.extname(file.originalname)}`,  // Generate a unique filename for each file
    };
  },
});

// Initialize multer with the storage engine
const upload = multer({ storage });

// Upload profile picture handler
exports.uploadProfilePic = upload.single("profilePic");  // Accept only a single file with the field name 'profilePic'

// Profile picture handler to save the file
exports.uploadProfilePicHandler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    file: req.file,
  });
};

// Serve profile picture from MongoDB GridFS
exports.serveProfilePic = (req, res) => {
  const filename = req.params.filename;

  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "profilePics",
  });

  const downloadStream = gridFSBucket.openDownloadStreamByName(filename);

  downloadStream.pipe(res);
  downloadStream.on("error", (err) => {
    return res.status(404).json({ message: "File not found" });
  });
};

// Remove profile picture from MongoDB GridFS
exports.removeProfilePic = async (req, res) => {
  const { filename } = req.body;

  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "profilePics",
  });

  const files = await mongoose.connection.db
    .collection("profilePics.files")
    .find({ filename: filename })
    .toArray();

  if (files.length === 0) {
    return res.status(404).json({ message: "File not found" });
  }

  gridFSBucket.delete(files[0]._id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting file" });
    }
    res.status(200).json({ message: "Profile picture removed successfully" });
  });
};
