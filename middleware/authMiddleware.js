const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized Access.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "ACCOUNT_DEACTIVATED",
      });
    }

    if (
      user.passwordChangedAt &&
      decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      return res.status(401).json({
        message: "PASSWORD_CHANGED",
      });
    }

    req.user = {
      id: user._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token.",
    });
  }
};

module.exports = authMiddleware;
