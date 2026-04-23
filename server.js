require("dotenv").config();
require("./db");

const express = require("express");
const cors    = require("cors");

const authRoutes    = require("./auth");
const analyzeRoute  = require("./routes/analyze");
const topStocks     = require("./routes/topStocks");
const sectors       = require("./routes/sectors");

const app = express();
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────
app.use("/auth",    authRoutes);
app.use("/analyze", analyzeRoute);
app.use("/",        topStocks);
app.use("/",        sectors);

// ── Start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
