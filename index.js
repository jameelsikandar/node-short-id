const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const staticRoute = require("./routes/staticRouter");
const app = express();
const PORT = 8000;

connectToMongoDB(
  "mongodb+srv://jameelsikandarr:open123khan%2F@cluster0.p1e8d.mongodb.net/URL-Shortner?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log(`DB Connected`));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error handling redirect:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
