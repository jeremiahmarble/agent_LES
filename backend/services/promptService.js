const fs = require('fs');
const path = require('path');

// Load system prompt from file
const systemPrompt = fs.readFileSync(path.join(__dirname, '../../prompts/system_prompt.txt'), 'utf8').trim();

/**
 * Formats the context that will be sent to the LLM
 * @param {string} userPrompt - The user's message
 * @returns {Array} Array of message objects for the LLM API
 */
function formatPromptContext(userPrompt) {
    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];
}

/**
 * Validates if a prompt follows the RAI principles
 * @param {string} prompt - The user's message
 * @returns {boolean} Whether the prompt is valid
 */
function validatePrompt(prompt) {
    // Basic validation - ensure prompt is not empty and is a string
    if (!prompt || typeof prompt !== 'string') {
        return false;
    }
    
    // Add more validation logic here if needed
    // For example, checking for inappropriate content, length limits, etc.
    
    return true;
}

module.exports = {
    formatPromptContext,
    validatePrompt,
    systemPrompt: systemPrompt // Export system prompt for testing/debugging
}; 