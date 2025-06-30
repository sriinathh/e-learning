// src/pages/ChatbotPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

// Chatbot backend API URL
const CHATBOT_API_URL = 'http://localhost:5001/api/chatbot';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [userId, setUserId] = useState('user_' + Math.random().toString(36).substring(2, 9)); // Generate a random user ID
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [conversation]);

  // Show welcome message on load
  useEffect(() => {
    setConversation([{ 
      sender: 'Bot', 
      message: 'Hello! I\'m EduBot, your AI learning assistant. How can I help you today?' 
    }]);
    
    // Load chat history if available
    loadChatHistory();
  }, []);

  // Load chat history from the server
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${CHATBOT_API_URL}/history?userId=${userId}`);
      
      if (response.data.success && response.data.history.length > 0) {
        // Transform the history into the conversation format used by the component
        const formattedHistory = response.data.history.map(msg => ({
          sender: msg.role === 'user' ? 'User' : 'Bot',
          message: msg.content
        }));
        
        setConversation(formattedHistory);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // If we can't load history, just keep the welcome message
      setIsOfflineMode(true);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    try {
      await axios.delete(`${CHATBOT_API_URL}/history`, { data: { userId } });
      setConversation([{ 
        sender: 'Bot', 
        message: 'Chat history cleared. How can I help you today?' 
      }]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setIsOfflineMode(true);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to the conversation
    const updatedConversation = [
      ...conversation, 
      { sender: 'User', message: message.trim() }
    ];
    setConversation(updatedConversation);
    
    const userMessage = message.trim();
    setMessage(''); // Clear input field immediately
    setLoading(true);

    try {
      // Call the backend API
      const response = await axios.post(
        `${CHATBOT_API_URL}/message`, 
        { message: userMessage, userId }
      );

      // Check if we're in fallback mode
      if (response.data.mode === 'fallback') {
        setIsOfflineMode(true);
      } else {
        setIsOfflineMode(false);
      }

      // Add bot response to the conversation
      setConversation([
        ...updatedConversation,
        { sender: 'Bot', message: response.data.reply }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsOfflineMode(true);
      setConversation([
        ...updatedConversation,
        { 
          sender: 'Bot', 
          message: 'Sorry, I encountered an error. Please try again later or check if the chatbot server is running.' 
        }
      ]);
    }

    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chat-header ${isOfflineMode ? 'offline-mode' : ''}`}>
        <div className="header-title">
          <span className="bot-icon">🤖</span>
          CampusConnect AI Assistant
          {isOfflineMode && <span className="offline-badge">Offline Mode</span>}
        </div>
        <div className="header-subtitle">
          {isOfflineMode 
            ? 'Running in offline mode with limited capabilities' 
            : 'Ask me anything about your studies!'
          }
        </div>
        <button onClick={clearChatHistory} className="clear-button">Clear Chat</button>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {conversation.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender.toLowerCase()}`}>
            {msg.sender === 'Bot' && <div className="avatar bot-avatar">🤖</div>}
            <div className="message-bubble">{msg.message}</div>
            {msg.sender === 'User' && <div className="avatar user-avatar">👤</div>}
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="avatar bot-avatar">🤖</div>
            <div className="message-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isOfflineMode ? "Chat in offline mode..." : "Ask me anything..."}
          rows={1}
          disabled={loading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={loading || !message.trim()}
          className={loading ? 'sending' : ''}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
