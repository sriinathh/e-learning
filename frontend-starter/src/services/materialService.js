import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all materials
export const getAllMaterials = async () => {
  try {
    const response = await axios.get(`${API_URL}/materials`);
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Get material by ID
export const getMaterialById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    throw error;
  }
};

// Upload a new material
export const uploadMaterial = async (materialData, onProgress) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(materialData).forEach(key => {
      if (key !== 'file' && key !== 'tags') {
        formData.append(key, materialData[key]);
      }
    });
    
    // Append tags as JSON string
    if (materialData.tags) {
      formData.append('tags', JSON.stringify(materialData.tags));
    }
    
    // Append file
    if (materialData.file) {
      formData.append('file', materialData.file);
    }
    
    // Handle progress
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      }
    };
    
    const response = await axios.post(`${API_URL}/materials`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading material:', error);
    throw error;
  }
};

// Delete a material
export const deleteMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting material with ID ${id}:`, error);
    throw error;
  }
};

// Download a material (increment download count)
export const downloadMaterial = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/materials/${id}/download`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading material with ID ${id}:`, error);
    throw error;
  }
};

// Rate a material
export const rateMaterial = async (id, rating) => {
  try {
    const response = await axios.post(`${API_URL}/materials/${id}/rate`, { rating }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error rating material with ID ${id}:`, error);
    throw error;
  }
};

// Search materials
export const searchMaterials = async (query, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/materials/search`, {
      params: {
        query,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching materials:', error);
    throw error;
  }
};

export default {
  getAllMaterials,
  getMaterialById,
  uploadMaterial,
  deleteMaterial,
  downloadMaterial,
  rateMaterial,
  searchMaterials
};