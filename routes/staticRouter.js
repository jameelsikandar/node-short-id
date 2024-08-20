const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("home", { id: null });
});

module.exports = router;
