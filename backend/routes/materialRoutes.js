const express = require('express');
const router = express.Router();
const { 
  getMaterials, 
  getMaterial, 
  addMaterial, 
  updateMaterial, 
  deleteMaterial, 
  rateMaterial, 
  likeMaterial, 
  incrementDownloads 
} = require('../controllers/materials/materialController');
const { protect } = require('../middleware/authMiddleware');

// Material routes
router.route('/')
  .get(protect, getMaterials)
  .post(protect, addMaterial);

router.route('/:id')
  .get(protect, getMaterial)
  .put(protect, updateMaterial)
  .delete(protect, deleteMaterial);

// Rating and likes
router.route('/:id/rate')
  .post(protect, rateMaterial);

router.route('/:id/like')
  .post(protect, likeMaterial);

// Download counter
router.route('/:id/download')
  .post(protect, incrementDownloads);

module.exports = router; 