const axios = require("axios");

/**
 * Send a prompt to Gemini Pro and return the response text.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function callAI(prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent` +
    `?key=${process.env.GEMINI_KEY}`;

  const res = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  return res.data.candidates[0].content.parts[0].text;
}

module.exports = { callAI };
    
