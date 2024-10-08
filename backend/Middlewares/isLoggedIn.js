const User = require("../models/userModel");
const ExpressError = require("../utils/ExpressError");
const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) {
    return next(new ExpressError(500, "logged in frist"));
  }
  try {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decode.email })
      .select("-password")
      .populate("cart.product")
      .populate("address");
    req.user = { user: user };
    next();
  } catch (err) {
    next(new ExpressError(500, "Authentication"));
  }
};
