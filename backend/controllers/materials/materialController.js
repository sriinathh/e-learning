const Material = require('../../models/Material');

// @desc    Get all materials
// @route   GET /api/materials
// @access  Private
const getMaterials = async (req, res) => {
  try {
    const { branch, subject, fileType } = req.query;
    
    // Build filter object
    const filter = {};
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject;
    if (fileType) filter.fileType = fileType;
    
    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Private
const getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('ratings.user', 'name email')
      .populate('likes', 'name email');
      
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new material
// @route   POST /api/materials
// @access  Private
const addMaterial = async (req, res) => {
  try {
    const { title, description, fileUrl, fileType, subject, branch } = req.body;
    
    // Create material
    const material = await Material.create({
      title,
      description,
      fileUrl,
      fileType,
      subject,
      branch,
      uploadedBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error adding material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterial = async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    // Make sure user is the material owner
    if (material.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this material'
      });
    }
    
    material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    // Make sure user is the material owner
    if (material.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this material'
      });
    }
    
    await material.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Rate material
// @route   POST /api/materials/:id/rate
// @access  Private
const rateMaterial = async (req, res) => {
  try {
    const { rating } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid rating between 1 and 5'
      });
    }
    
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    // Check if user already rated
    const alreadyRated = material.ratings.find(
      r => r.user.toString() === req.user.id
    );
    
    if (alreadyRated) {
      // Update existing rating
      material.ratings.forEach(r => {
        if (r.user.toString() === req.user.id) {
          r.rating = rating;
        }
      });
    } else {
      // Add new rating
      material.ratings.push({
        user: req.user.id,
        rating
      });
    }
    
    await material.save();
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error rating material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Like material
// @route   POST /api/materials/:id/like
// @access  Private
const likeMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    // Check if the material has already been liked by this user
    if (material.likes.includes(req.user.id)) {
      // Unlike
      material.likes = material.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // Like
      material.likes.push(req.user.id);
    }
    
    await material.save();
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error liking material:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Increment download count
// @route   POST /api/materials/:id/download
// @access  Private
const incrementDownloads = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    material.downloads += 1;
    await material.save();
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getMaterials,
  getMaterial,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  rateMaterial,
  likeMaterial,
  incrementDownloads
}; 