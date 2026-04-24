const express = require("express");
const User    = require("../../userModel");
const { callAI }   = require("../../services/aiService");
const { getStock } = require("../../services/stockService");
const { getNews }  = require("../../services/newsService");

const router = express.Router();

/**
 * POST /analyze
 * Body: { stock, email, language }
 */
router.post("/", async (req, res) => {
  try {
    const { stock, email, language } = req.body;

    // ── Auth check ──────────────────────────────
    const user = await User.findOne({ email });
    if (!user || (!user.isPremium && user.role !== "admin")) {
      return res.status(403).json({ error: "Upgrade to Premium required" });
    }

    // ── Fetch data in parallel ───────────────────
    const [stockData, newsData] = await Promise.all([
      getStock(stock),
      getNews(stock),
    ]);

    const newsText = newsData.map((n) => n.title).join("\n");

    // ── AI prompt ───────────────────────────────
    const prompt = `
Analyze stock: ${stock}

Current Price: ${stockData.c}
High: ${stockData.h} | Low: ${stockData.l} | Prev Close: ${stockData.pc}

Recent News:
${newsText}

Give:
- BUY / SELL / HOLD decision
- Clear reason
- Future growth outlook
- Risk level (Low/Medium/High)

Language: ${language}
    `.trim();

    const result = await callAI(prompt);

    res.json({
      price: stockData.c,
      high:  stockData.h,
      low:   stockData.l,
      news:  newsText,
      result,
    });
  } catch (err) {
    console.error("❌ /analyze error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
