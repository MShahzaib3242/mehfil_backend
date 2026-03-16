const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

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
      user,
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
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in.",
      error: error.message,
    });
  }
};
