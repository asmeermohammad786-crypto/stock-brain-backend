const express = require("express");
const { callAI }  = require("../services/aiService");
const { getNews } = require("../services/newsService");

const router = express.Router();

const SECTORS = ["Energy", "Banking", "Defence", "IT", "Consumption"];

let cache = [];
let lastUpdated = null;

// ── Build / refresh cache ─────────────────────────
async function updateSectors() {
  console.log("🔄 Updating sectors...");
  const data = [];

  for (const sector of SECTORS) {
    try {
      const news     = await getNews(sector, 3);
      const newsText = news.map((n) => n.title).join("\n");

      const prompt = `
Analyze sector: ${sector}

Recent News:
${newsText}

Give:
- Growth level: High / Medium / Low
- Key reason (2-3 lines)
- Outlook for next 3 months
      `.trim();

      const analysis = await callAI(prompt);
      data.push({ sector, analysis });
    } catch (err) {
      console.error(`❌ sectors — ${sector}:`, err.message);
    }
  }

  cache       = data;
  lastUpdated = new Date().toISOString();
  console.log(`✅ Sectors updated at ${lastUpdated}`);
}

// ── GET /sectors ──────────────────────────────────
router.get("/sectors", (req, res) => {
  res.json({ lastUpdated, sectors: cache });
});

// ── Auto-refresh every 15 minutes ─────────────────
updateSectors(); // run once on startup
setInterval(updateSectors, 15 * 60 * 1000);

module.exports = router;
      
