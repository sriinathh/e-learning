const axios = require('axios');

// Mistral API configuration
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Process a chat message using Mistral API
 */
const processMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.MISTRAL_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                success: false, 
                message: 'Mistral API key not configured' 
            });
        }

        const response = await axios.post(
            MISTRAL_API_URL, 
            {
                model: "mistral-small-latest",
                messages: [
                    {
                        role: "system",
                        content: "You are CampusBot, an educational assistant for the CampusConnect platform. You help students with their studies, explain concepts, and provide guidance on educational topics."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the assistant's reply from the Mistral API response
        const assistantReply = response.data.choices[0].message.content;

        return res.json({
            success: true,
            reply: assistantReply
        });
    } catch (error) {
        console.error('Mistral API Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            message: 'Error communicating with Mistral AI',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    processMessage
}; 