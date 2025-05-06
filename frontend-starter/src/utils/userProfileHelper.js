// Helper functions for user profile management
import { addUserToCommunity } from './communityUtils';

// Update user profile with community-friendly format
export const setupUserProfile = (user) => {
  try {
    if (!user) return null;
    
    // Format user data
    const communityUser = {
      _id: user._id || `user-${Date.now()}`,
      username: user.username || user.name,
      name: user.name || user.username,
      email: user.email || 'user@example.com',
      isOnline: true,
      profilePic: user.profilePic || user.profilePicture || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=random`,
      isReal: true,
      joinedAt: new Date().toISOString()
    };
    
    // Add to community users
    addUserToCommunity(communityUser);
    
    return communityUser;
  } catch (error) {
    console.error('Error setting up user profile:', error);
    return null;
  }
};

// Generate random profile picture URL
export const generateProfilePicture = (name) => {
  const colors = ['4299E1', 'ED8936', '48BB78', '805AD5', 'D53F8C'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff`;
};

// Format name for display
export const formatDisplayName = (user) => {
  if (!user) return 'Guest';
  return user.name || user.username || 'Anonymous';
};

export default {
  setupUserProfile,
  generateProfilePicture,
  formatDisplayName
}; 