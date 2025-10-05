const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists'
      });
    }

    const user = await User.create({ username, password });
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username } }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username } }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

module.exports = router;