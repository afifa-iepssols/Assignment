const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Business = require('../models/businessModel');

require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, fullname, password, role } = req.body //filled by user 
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username taken, try something else." });
        }
        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = new User({ username, fullname, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({message: `User registered with username: ${username}`});
    } catch(error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    // Set cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // send only over HTTPS
        sameSite: "None", // prevent CSRF
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({ message: "Login successful" });
  };

  const logout = (req, res) => {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  };

  const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hasBusiness = await Business.exists({ owner: user._id });

        res.status(200).json({
            username: user.username,
            role: user.role,
            hasBusiness: Boolean(hasBusiness),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { register, login, logout, getCurrentUser };
