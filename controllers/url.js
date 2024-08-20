const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  try {
    const body = req.body;

    if (!body || !body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const newShortId = shortid.generate(); // Correctly generate a new short ID

    const newUrl = await URL.create({
      shortId: newShortId,
      redirectUrl: body.url,
      visitHistory: [],
    });

    return res.render("home", { id: newShortId });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
