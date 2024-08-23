const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const URL = require("../models/url");
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    await User.create({
      name,
      email,
      password,
    });

    // Fetch all existing URLs to pass to the template
    const allUrls = await URL.find({});

    return res.render("/", { id: null, urls: allUrls });
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render("login", { error: "Invalid Username Or Password" });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    return res.redirect("/");
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
