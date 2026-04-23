const axios = require("axios");

/**
 * Fetch recent news headlines for a query.
 * @param {string} query   e.g. "AAPL" or "Banking"
 * @param {number} count   how many articles to return (default 3)
 * @returns {Promise<Array>}
 */
async function getNews(query, count = 3) {
  const res = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q:      query,
      sortBy: "publishedAt",
      apiKey: process.env.NEWS_KEY,
    },
  });
  return res.data.articles.slice(0, count);
}

module.exports = { getNews };
