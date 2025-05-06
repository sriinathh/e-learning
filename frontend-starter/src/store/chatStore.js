import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,

  // General chat messages
  fetchMessages: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('http://localhost:5000/api/chats/messages', {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
        },
      });
      set({ messages: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || "Failed to fetch messages",
        isLoading: false 
      });
    }
  },

  sendMessage: async (content) => {
    try {
      const user = useAuthStore.getState().authUser;
      if (!user) return { success: false, error: "Not authenticated" };

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Optimistically update UI
      const tempMessage = {
        id: Date.now().toString(),
        content,
        sender: { username: user.username, _id: user._id },
        createdAt: time,
        isCurrentUser: true,
        pending: true
      };
      
      set({ messages: [...get().messages, tempMessage] });

      // Check if we're in a group or general chat
      let url = 'http://localhost:5000/api/chats/messages';
      const currentGroup = get().currentGroup;
      
      if (currentGroup) {
        url = `http://localhost:5000/api/groups/${currentGroup._id}/messages`;
      }

      // Send to server
      const { data } = await axios.post(
        url,
        { content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update with actual message from server
      set({ 
        messages: get().messages.map(msg => 
          msg.id === tempMessage.id ? data : msg
        )
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Failed to send message"
      };
    }
  },

  // Online users
  fetchOnlineUsers: async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chats/users', {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
        },
      });
      set({ users: data });
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  },

  // Groups functionality
  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
        },
      });
      set({ groups: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      set({ 
        error: error.response?.data?.message || error.message || "Failed to fetch groups",
        isLoading: false 
      });
    }
  },

  createGroup: async (groupData) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/groups',
        groupData,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
          },
        }
      );
      set({ groups: [...get().groups, data] });
      return { success: true, group: data };
    } catch (error) {
      console.error('Failed to create group:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Failed to create group"
      };
    }
  },

  fetchGroupDetails: async (groupId) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
        },
      });
      set({ currentGroup: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Failed to fetch group details:', error);
      set({ 
        error: error.response?.data?.message || error.message || "Failed to fetch group details",
        isLoading: false 
      });
      return null;
    }
  },

  fetchGroupMessages: async (groupId) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`http://localhost:5000/api/groups/${groupId}/messages`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
        },
      });
      set({ messages: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
      set({ 
        error: error.response?.data?.message || error.message || "Failed to fetch group messages",
        isLoading: false 
      });
    }
  },

  joinGroup: async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
          },
        }
      );
      
      // Update current group to reflect membership
      if (get().currentGroup && get().currentGroup._id === groupId) {
        set({ 
          currentGroup: {
            ...get().currentGroup,
            isMember: true,
            members: [...get().currentGroup.members, {
              _id: useAuthStore.getState().authUser._id,
              username: useAuthStore.getState().authUser.username,
              profilePic: useAuthStore.getState().authUser.profilePic,
              isOnline: true
            }]
          }
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to join group:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Failed to join group"
      };
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().authUser?.token}`,
          },
        }
      );
      
      // If we're viewing the group we just left, clear it
      if (get().currentGroup && get().currentGroup._id === groupId) {
        set({ 
          currentGroup: null,
          messages: []
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to leave group:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Failed to leave group"
      };
    }
  },

  setCurrentGroup: (group) => {
    set({ currentGroup: group, messages: [] });
  },

  clearCurrentGroup: () => {
    set({ currentGroup: null, messages: [] });
  },

  // Local data getters - For development and demo purposes
  getLocalUsers: () => {
    // Get the current user from localStorage
    let currentUser = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        // Add required fields for consistency
        currentUser.isOnline = true;
        currentUser.isReal = true;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }

    // Only use real users from communityUsers in localStorage
    let communityUsers = [];
    try {
      const storedUsers = localStorage.getItem('communityUsers');
      if (storedUsers) {
        // Parse stored users and filter out any without isReal flag
        const parsedUsers = JSON.parse(storedUsers);
        communityUsers = parsedUsers.filter(user => 
          user.isReal === true && (!currentUser || user._id !== currentUser._id)
        );
      }
    } catch (error) {
      console.error('Error getting community users:', error);
    }

    // Create the final list with current user first
    let finalUsers = [];
    
    // Add current user if available
    if (currentUser) {
      finalUsers.push({
        _id: currentUser._id,
        username: currentUser.username || currentUser.name,
        isOnline: true,
        profilePic: currentUser.profilePic || currentUser.profilePicture || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username || currentUser.name)}&background=random`,
        isReal: true
      });
    }
    
    // Add other users
    finalUsers = [...finalUsers, ...communityUsers];
    
    return finalUsers;
  },

  getLocalMessages: () => {
    const user = useAuthStore.getState().authUser;
    
    // Create a welcome message from the current user or system
    if (user) {
      return [
        {
          id: 'welcome-' + Date.now(),
          content: "Welcome to the community chat! Connect with other learners here.",
          sender: { 
            username: user.username || user.name, 
            _id: user._id,
            profilePic: user.profilePic || user.profilePicture
          },
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser: true,
        }
      ];
    } else {
      // System message if no user is logged in
      return [
        {
          id: 'welcome-system',
          content: "Welcome to the community chat! Please log in to join the conversation.",
          sender: { username: "System", _id: "system" },
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser: false,
        }
      ];
    }
  },

  getLocalGroups: () => {
    return [
      { 
        _id: "g1", 
        name: "Programming Help", 
        description: "Get help with coding problems", 
        createdBy: { username: "Srinath", _id: "1" },
        members: 24
      },
      { 
        _id: "g2", 
        name: "Math Study Group", 
        description: "Advanced mathematics discussions", 
        createdBy: { username: "Rakesh", _id: "2" },
        members: 15
      },
      { 
        _id: "g3", 
        name: "Language Exchange", 
        description: "Practice different languages", 
        createdBy: { username: "Bharath", _id: "3" },
        members: 32
      }
    ];
  }
}));

export default useChatStore; 