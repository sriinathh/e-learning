import { useEffect, useRef, useState } from 'react';
import { setupUserPresence } from './communityEvents';

/**
 * Custom hook to handle user presence with proper cleanup
 * This fixes the React Hooks warning by ensuring consistent hook order
 * 
 * @param {string} userId - The user ID to set up presence for
 * @returns {void}
 */
export const useUserPresence = (userId) => {
  // Always declare all hooks at the top level regardless of conditions
  const cleanupRef = useRef(null);
  const userIdRef = useRef(null);
  const [hasLoggedWarning, setHasLoggedWarning] = useState(false);
  
  // Update the ref whenever userId changes
  useEffect(() => {
    userIdRef.current = userId;
    
    // Log only once if userId is not available
    if (!userId && !hasLoggedWarning) {
      console.log('useUserPresence: No userId provided yet, will retry when available');
      setHasLoggedWarning(true);
    }
  }, [userId, hasLoggedWarning]);
  
  // Set up presence in a separate effect that does not depend on userId directly
  useEffect(() => {
    // Function to set up presence using the current value from ref
    const setupPresence = () => {
      // Clean up previous presence if it exists
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      
      const currentUserId = userIdRef.current;
      if (!currentUserId) {
        return; // Skip setup if no user ID
      }
      
      console.log('userId became available, setting up presence');
      // Set up presence and store cleanup function
      try {
        console.log('Setting up presence for user with hook:', currentUserId);
        cleanupRef.current = setupUserPresence(currentUserId);
      } catch (error) {
        console.error('Error setting up user presence:', error);
      }
    };
    
    // Initial setup
    setupPresence();
    
    // Set up interval to check for userId availability
    const intervalId = setInterval(() => {
      const currentUserId = userIdRef.current;
      if (currentUserId && !cleanupRef.current) {
        console.log('userID now available in interval, setting up presence');
        setupPresence();
        clearInterval(intervalId);
      }
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this only runs once
}; 