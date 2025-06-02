const path = require('path');
const fs = require('fs');

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
console.log('Checking .env file at:', envPath);
console.log('The .env file exists:', fs.existsSync(envPath));

// Try to read .env file contents (safely)
try {
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log('Number of lines in .env:', envContents.split('\n').length);
  //console.log('First few characters of .env:', envContents.substring(0, 20) + '...');
} catch (err) {
  console.error('Error reading .env file:', err.message);
}

// Load environment variables
require('dotenv').config();

// Debug logging
console.log('Current working directory:', process.cwd());
console.log('Environment variables:', {
  llmService: process.env.LLM_SERVICE,
  hasServiceKey: !!process.env.LLM_SERVICE_KEY,
  model: process.env.MODEL,
  port: process.env.PORT
});

const config = {
  llmService: process.env.LLM_SERVICE?.toUpperCase() || 'GROQ',
  llmServiceKey: process.env.LLM_SERVICE_KEY,
  model: process.env.MODEL,
  port: process.env.PORT || 3000
};

// Validate configuration
if (!config.llmServiceKey) {
  console.error('❌ LLM_SERVICE_KEY is not set in environment variables');
  process.exit(1);
}

if (!config.llmService) {
  console.error('❌ LLM_SERVICE is not set in environment variables');
  process.exit(1);
}

module.exports = config; 