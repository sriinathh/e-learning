require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Debugging: log the API key
console.log('MISTRAL API Key:', process.env.MISTRAL_API_KEY);
app.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ message: 'API key is missing' });
    }

    const url = 'https://api.mistral.ai/v1/chat/completions';

    const response = await axios.post(url, {
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: req.body.message
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to connect to Mistral API' });
  }
});
