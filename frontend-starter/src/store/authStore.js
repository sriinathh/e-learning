// src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  authUser: null, // initial state for the user
  isUpdatingProfile: false, // to track if the profile update is in progress
  
  // Set the authenticated user (e.g., after a successful login)
  setAuthUser: (user) => set({ authUser: user }),

  // Function to update the user's profile
  updateProfile: async (updatedData) => {
    try {
      // Example API call for updating the profile
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      set({ authUser: data }); // Update the authUser with new profile data
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
}));

export default useAuthStore;
