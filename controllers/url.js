const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  try {
    const body = req.body;

    if (!body || !body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const newShortId = shortid.generate(); // Generate a new short ID

    await URL.create({
      shortId: newShortId,
      redirectUrl: body.url,
      visitHistory: [],
      createdBy: req.user._id, // Set the createdBy field
    });

    // Fetch only the URLs created by the logged-in user
    const userUrls = await URL.find({ createdBy: req.user._id });

    return res.render("home", { id: newShortId, urls: userUrls });
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
