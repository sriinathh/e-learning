const { queryMistralAPI } = require('../utils/mistralApiHelper');

const handleMistralChat = async (req, res) => {
  const { messages, model, temperature, maxTokens, customInstructions } = req.body;

  try {
    const reply = await queryMistralAPI({
      messages,
      model,
      temperature,
      maxTokens,
      system: customInstructions
    });

    res.status(200).json({ success: true, message: reply });
  } catch (error) {
    console.error('Mistral API Error:', error?.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Mistral API Error',
      details: error.response?.data || error.message
    });
  }
};

const fetchMistralModels = (req, res) => {
  res.json({
    success: true,
    defaultModel: 'mistral-small-latest',
    models: ['mistral-small-latest', 'mistral-medium-latest']
  });
};

module.exports = {
  handleMistralChat,
  fetchMistralModels
};
