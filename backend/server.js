const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const askLLM = require('./services/llmService');
const config = require('./config');
const formatPromptOutput = require('./services/promptFormatter');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';

// Debug logging
console.log('Server starting...');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Agent LES is running at http://${HOST}:${PORT}`);
}); 

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;
  try {
    const reply = await askLLM(prompt);
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

app.get('/api/info', (req, res) => {
  res.json({
    service: config.llmService,
    model: config.model || 'default',
  });
});

app.post('/api/format', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid text' });
  }
  const html = formatPromptOutput(text);
  res.json({ html });
});

