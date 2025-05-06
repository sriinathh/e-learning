# Mistral AI Integration for CampusConnect

This document provides instructions on how to set up and use the Mistral AI integration for the CampusConnect feature in the e-learning platform.

## Setup Instructions

### 1. Create a Mistral AI Account

1. Visit [Mistral AI Console](https://console.mistral.ai/) and create an account
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the API key to use in the next step

### 2. Configure Environment Variables

1. In the `backend` directory, create a `.env` file if it doesn't exist
2. Add your Mistral API key to the `.env` file:

```
MISTRAL_API_KEY=your_api_key_here
```

### 3. Restart the Server

After adding the API key, restart the backend server to apply the changes.

## Available Models

The integration supports several Mistral AI models:

- **mistral-tiny-latest**: Fastest, best for simple queries
- **mistral-small-latest**: Good balance of performance and quality
- **mistral-medium-latest**: Better quality for complex tasks
- **mistral-large-latest**: Highest quality, best for complex reasoning

## API Endpoints

### Chat Completion

```
POST /api/chat/campusconnect
```

**Request Body:**

```json
{
  "messages": [
    { "role": "user", "content": "Your message here" }
  ],
  "model": "mistral-small-latest",      // Optional, defaults to small
  "temperature": 0.7,                   // Optional, defaults to 0.7
  "maxTokens": 1024,                    // Optional, defaults to 1024
  "customInstructions": ""              // Optional, additional system prompt
}
```

**Response:**

```json
{
  "success": true,
  "message": "AI response text here",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  },
  "model": "mistral-small-latest"
}
```

### Available Models

```
GET /api/chat/models
```

**Response:**

```json
{
  "success": true,
  "models": [
    { "id": "mistral-small-latest", "name": "small" },
    { "id": "mistral-medium-latest", "name": "medium" },
    { "id": "mistral-large-latest", "name": "large" },
    { "id": "mistral-tiny-latest", "name": "tiny" }
  ],
  "defaultModel": "mistral-small-latest"
}
```

## Error Handling

The API provides detailed error messages for common issues:

- **401 Unauthorized**: API key is invalid or not configured
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: General server error

## Frontend Integration

The `CampusConnectChat` component is already configured to work with this API. Users can:

1. Send messages to the AI
2. Choose different AI models
3. Adjust the temperature (creativity) of responses
4. Set the maximum token length
5. Add custom instructions

## Troubleshooting

If you encounter any issues:

1. Check that your API key is valid and correctly added to the `.env` file
2. Make sure the backend server is running
3. Check the server logs for any error messages
4. Verify your network connectivity to the Mistral API (api.mistral.ai)

For more information on the Mistral API, see their [official documentation](https://docs.mistral.ai/). 