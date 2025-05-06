const axios = require('axios');

const queryMistralAPI = async ({ messages, model, temperature, maxTokens, system }) => {
  const formattedMessages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...messages
  ];

  const response = await axios.post(
    'https://api.mistral.ai/v1/chat/completions',
    {
      model,
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content.trim();
};

module.exports = {
  queryMistralAPI
};
