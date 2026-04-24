const express  = require("express");
const { callAI }   = require("../../services/aiService");
const { getStock } = require("../../services/stockService");

const router = express.Router();

const SYMBOLS = [
  "AAPL","MSFT","GOOGL","TSLA","NVDA",
  "AMZN","META","NFLX","TCS","INFY",
];

let cache = [];       // in-memory cache
let lastUpdated = null;

// ── Build / refresh cache ─────────────────────────
async function updateTopStocks() {
  console.log("🔄 Updating top stocks...");
  const data = [];

  for (const sym of SYMBOLS) {
    try {
      const stockData = await getStock(sym);

      const prompt = `
Analyze stock ${sym}.
Price: ${stockData.c}

Evaluate:
- Growth potential
- Fundamentals
- Future outlook

Give a score out of 100 with a 2-line reason.
      `.trim();

      const analysis = await callAI(prompt);

      data.push({ stock: sym, price: stockData.c, analysis });
    } catch (err) {
      console.error(`❌ topStocks — ${sym}:`, err.message);
    }
  }

  cache       = data;
  lastUpdated = new Date().toISOString();
  console.log(`✅ Top stocks updated at ${lastUpdated}`);
}

// ── GET /top-stocks ───────────────────────────────
router.get("/top-stocks", (req, res) => {
  res.json({ lastUpdated, stocks: cache });
});

// ── Auto-refresh every 10 minutes ─────────────────
updateTopStocks(); // run once on startup
setInterval(updateTopStocks, 10 * 60 * 1000);

module.exports = router;
