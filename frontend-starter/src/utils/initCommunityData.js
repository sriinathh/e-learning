// This script initializes the community data with default values
import { initializeCommunityData } from './communityUtils';

// Initialize community data when imported
const init = () => {
  try {
    console.log('Initializing community data...');
    initializeCommunityData();
    console.log('Community data initialized successfully!');
  } catch (error) {
    console.error('Error initializing community data:', error);
  }
};

// Call init function
init();

export default init; 