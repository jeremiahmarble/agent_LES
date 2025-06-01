const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const askLLM = require('./services/llmService');

// Debug logging
console.log('Server starting...');
console.log('Environment variables loaded:', {
  llmService: process.env.LLM_SERVICE,
  hasServiceKey: !!process.env.LLM_SERVICE_KEY,
  model: process.env.MODEL,
  port: process.env.PORT,
  envPath: path.resolve(__dirname, '../.env')
});

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LES_agent running on port ${PORT}`));
