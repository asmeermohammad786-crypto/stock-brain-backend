const axios = require("axios");

/**
 * Fetch live stock quote from Finnhub.
 * Returns { c (current), h (high), l (low), o (open), pc (prev close) }
 * @param {string} symbol  e.g. "AAPL"
 * @returns {Promise<object>}
 */
async function getStock(symbol) {
  const res = await axios.get("https://finnhub.io/api/v1/quote", {
    params: {
      symbol,
      token: process.env.FINNHUB_KEY,
    },
  });
  return res.data;
}

module.exports = { getStock };
