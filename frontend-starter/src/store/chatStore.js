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

  // Local mock data for development
  getLocalUsers: () => {
    return [
      { _id: 1, username: "Srinath", isOnline: true },
      { _id: 2, username: "Rakesh", isOnline: true },
      { _id: 3, username: "Bharath", isOnline: false },
      { _id: 4, username: useAuthStore.getState().authUser?.username || "You", isOnline: true },
    ];
  },

  getLocalMessages: () => {
    const user = useAuthStore.getState().authUser;
    return [
      {
        id: 1,
        content: "Hey everyone! Welcome to the community chat!",
        sender: { username: "Srinath", _id: "1" },
        createdAt: "10:30 AM",
        isCurrentUser: false,
      },
      {
        id: 2,
        content: "Great to see this feature added to EduConnect 🚀",
        sender: { username: "Rakesh", _id: "2" },
        createdAt: "10:31 AM",
        isCurrentUser: false,
      },
      {
        id: 3,
        content: "How is everyone doing today?",
        sender: { username: user?.username || "You", _id: user?._id || "current" },
        createdAt: "10:32 AM",
        isCurrentUser: true,
      },
    ];
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