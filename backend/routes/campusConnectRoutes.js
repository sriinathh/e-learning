const express = require("express");
const axios = require("axios");
const router = express.Router();

// Environment variable for Mistral API key
// Add MISTRAL_API_KEY to your .env file
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Available Mistral models
const MISTRAL_MODELS = {
  SMALL: "mistral-small-latest",
  MEDIUM: "mistral-medium-latest",
  LARGE: "mistral-large-latest",
  TINY: "mistral-tiny-latest",
  // Add more models as they become available
};

// Default model to use
const DEFAULT_MODEL = MISTRAL_MODELS.SMALL;

// Check if API key is set
const isApiKeyConfigured = MISTRAL_API_KEY && MISTRAL_API_KEY !== "YOUR_MISTRAL_API_KEY" && MISTRAL_API_KEY.length > 10;

// Helper function to format messages for Mistral API
const formatMessagesForMistral = (messages) => {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));
};

// Create a system prompt for the AI assistant
const createSystemPrompt = (customInstructions = "") => {
  const basePrompt = "You are CampusConnect, an educational AI assistant for students. You provide helpful, accurate information about academic subjects, study techniques, and educational resources. Always be supportive, concise, and focus on educational topics. If asked about non-educational topics, politely redirect to educational content. If you don't know an answer, admit it rather than making up information.";
  
  return {
    role: "system",
    content: customInstructions ? `${basePrompt} ${customInstructions}` : basePrompt
  };
};

// Generate AI response using Mistral API
router.post("/campusconnect", async (req, res) => {
  try {
    const { messages, model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 1024, customInstructions = "" } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid message format",
        details: "Messages must be provided as an array of {role, content} objects"
      });
    }

    console.log("Received messages:", JSON.stringify(messages.slice(-3)));

    // Check if API key is configured
    if (!isApiKeyConfigured) {
      console.error("Mistral API key is not configured properly");
      return res.status(401).json({ 
        success: false,
        message: "Mistral API key is not configured. Please add a valid API key in your .env file.",
        details: "You need to create a .env file in the backend directory with MISTRAL_API_KEY=your_key"
      });
    }

    // Validate the model
    const selectedModel = MISTRAL_MODELS[model.toUpperCase()] || DEFAULT_MODEL;
    
    // Format messages for Mistral API
    const formattedMessages = formatMessagesForMistral(messages);

    // Add system prompt at the beginning
    const systemPrompt = createSystemPrompt(customInstructions);
    formattedMessages.unshift(systemPrompt);

    // Call Mistral API
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: selectedModel,
        messages: formattedMessages,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(maxTokens, 10)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        }
      }
    );

    console.log("Mistral API response status:", response.status);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const aiMessage = response.data.choices[0].message.content;
      
      // Return full response for advanced usage
      return res.json({
        success: true,
        message: aiMessage,
        usage: response.data.usage,
        model: selectedModel
      });
    } else {
      console.error("Unexpected API response format:", response.data);
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("CampusConnect error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        success: false,
        message: "API key error. Please check your Mistral API credentials.",
        details: "You need to sign up for Mistral AI at https://console.mistral.ai/ and get a valid API key"
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Too many requests to the Mistral API.",
        details: "Please wait a moment and try again, or consider upgrading your Mistral API plan."
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error generating response from AI service",
      error: error.message,
      details: error.response?.data || "Unknown error occurred"
    });
  }
});

// Get available models
router.get("/models", (req, res) => {
  try {
    // Check if API key is configured
    if (!isApiKeyConfigured) {
      return res.status(401).json({
        success: false,
        message: "Mistral API key is not configured."
      });
    }
    
    return res.json({
      success: true,
      models: Object.entries(MISTRAL_MODELS).map(([key, value]) => ({
        id: value,
        name: key.toLowerCase().replace('_', ' ')
      })),
      defaultModel: DEFAULT_MODEL
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available models",
      error: error.message
    });
  }
});

module.exports = router; 