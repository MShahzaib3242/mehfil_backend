const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, bio, avatar } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      throw new ApiError(400, "Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      bio: bio || "",
      avatar: avatar || "",
    });

    res.status(201).json({
      message: "User registered successfully.",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering User.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "The user does not exist.",
      });
    }

    if (!user.isActive) {
      throw new ApiError(403, "ACCOUNT_DEACTIVATED");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials.",
      });
    }

    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login Successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Error logging in.",
      error: error.message,
    });
  }
};

exports.checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        available: false,
        message: "Username is already taken",
      });
    }

    return res.json({
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error checking username",
      error: error.message,
    });
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await user.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        username: email.split("@")[0],
        avatar: picture,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
