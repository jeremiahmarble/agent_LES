const axios = require('axios');
const config = require('../config');
const { formatPromptContext, validatePrompt } = require('./promptService');

// LLM Service endpoints and configurations
const LLM_SERVICES = {
  GROQ: {
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    headerKey: 'Authorization',
    headerValue: (key) => `Bearer ${key}`,
    defaultModel: 'llama-3.3-70b-versatile'
  },
  AZURE: {
    baseUrl: (endpoint, apiVersion) => `${endpoint}/openai/deployments/${process.env.MODEL || 'gpt-4o'}/chat/completions?api-version=${apiVersion}`,
    headerKey: 'api-key',
    headerValue: (key) => key,
    defaultModel: 'gpt-4o'
  },
  OPENAI: {
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    headerKey: 'Authorization',
    headerValue: (key) => `Bearer ${key}`,
    defaultModel: 'gpt-4'
  },
  CLAUDE: {
    baseUrl: 'https://api.anthropic.com/v1/messages',
    headerKey: 'x-api-key',
    headerValue: (key) => key,
    defaultModel: 'claude-3-opus-20240229'
  },
  GEMINI: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    headerKey: 'x-goog-api-key',
    headerValue: (key) => key,
    defaultModel: 'gemini-pro'
  }
};

async function askLLM(prompt) {
  // Validate the prompt first
  if (!validatePrompt(prompt)) {
    throw new Error('Invalid prompt');
  }

  const service = process.env.LLM_SERVICE?.toUpperCase() || 'GROQ';
  const apiKey = process.env.LLM_SERVICE_KEY;
  const model = process.env.MODEL ? process.env.MODEL.trim() : LLM_SERVICES[service].defaultModel;

  if (!LLM_SERVICES[service]) {
    throw new Error(`Unsupported LLM service: ${service}`);
  }

  if (!apiKey) {
    throw new Error(`API key not found for ${service}`);
  }

  const serviceConfig = LLM_SERVICES[service];

  // Handle Azure's different URL structure
  let requestUrl;
  let requestBody;
  
  if (service === 'AZURE') {
    const endpoint = process.env.AZURE_ENDPOINT;
    const apiVersion = process.env.AZURE_API_VERSION || '2024-02-15-preview';
    
    if (!endpoint) {
      throw new Error('AZURE_ENDPOINT is required for Azure service');
    }
    
    requestUrl = serviceConfig.baseUrl(endpoint, apiVersion);
    requestBody = {
      messages: formatPromptContext(prompt)
    };
  } else {
    requestUrl = serviceConfig.baseUrl;
    requestBody = {
      model: model,
      messages: formatPromptContext(prompt)
    };
  }

  try {
    const response = await axios.post(
      requestUrl,
      requestBody,
      {
        headers: {
          [serviceConfig.headerKey]: serviceConfig.headerValue(apiKey),
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle different response formats from different services
    switch (service) {
      case 'GROQ':
      case 'OPENAI':
      case 'AZURE':
        return response.data.choices[0].message.content;
      case 'CLAUDE':
        return response.data.content[0].text;
      case 'GEMINI':
        return response.data.candidates[0].content.parts[0].text;
      default:
        throw new Error(`Unsupported service response format: ${service}`);
    }
  } catch (err) {
    console.error(`🛑 ${service} API error:`);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    throw err;
  }
}

module.exports = askLLM;
