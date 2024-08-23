const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;
  if (!userUid) {
    return res.redirect("/login");
  }

  const user = await getUser(userUid);
  if (!user) {
    return res.redirect("/login");
  }

  req.user = user;
  // Debugging: Log the user object

  next(); // Proceed to the next middleware or route handler
}

async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;

  const user = getUser(userUid);

  req.user = user;

  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
