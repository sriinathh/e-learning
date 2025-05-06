const axios = require('axios');

exports.chatWithAI = async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({
      success: false,
      message: 'No message provided in request',
    });
  }

  try {
    const data = {
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: userMessage }],
      temperature: 0.7,
      max_tokens: 150,
    };

    // Log API key (for debugging purposes)
    console.log('Mistral API Key:', process.env.MISTRAL_API_KEY);

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      data,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the AI's response
    res.status(200).json({
      success: true,
      aiResponse: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error connecting to the AI service',
      error: error.response ? error.response.data : error.message,
    });
  }
};
