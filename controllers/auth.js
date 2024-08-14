const User = require('../models/User'); // Adjust the path based on the project structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { register, login };