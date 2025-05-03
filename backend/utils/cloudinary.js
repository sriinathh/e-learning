const cloudinary = require("cloudinary").v2;

// Use default values if env variables aren't set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "123456789012345",
  api_secret: process.env.CLOUDINARY_API_SECRET || "abcdefghijklmnopqrstuvwxyz12",
});

// Function to upload base64 image to Cloudinary
const uploadBase64Image = async (base64Image) => {
  try {
    if (!base64Image || typeof base64Image !== 'string') {
      throw new Error('Invalid image data');
    }
    
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pics",
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading image to cloud storage');
  }
};

module.exports = { uploadBase64Image, cloudinary };
