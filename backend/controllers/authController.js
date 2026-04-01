const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!name || !age || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({ name, age, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        age:   user.age,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        age:   user.age,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (name)  user.name  = name;
    if (age)   user.age   = age;
    if (email) user.email = email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id:   updatedUser._id,
        name:  updatedUser.name,
        age:   updatedUser.age,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during update." });
  }
};

module.exports = { register, login, getMe, updateProfile };
