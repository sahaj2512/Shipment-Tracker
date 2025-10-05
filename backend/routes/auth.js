const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body); // Add logging
    
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('❌ User already exists:', username);
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists'
      });
    }

    console.log('✅ Creating new user:', username);
    
    // Create user
    const user = await User.create({ 
      username, 
      password // This will be hashed by the pre-save hook
    });

    const token = signToken(user._id);

    console.log('✅ User created successfully:', user.username);
    
    res.status(201).json({
      status: 'success',
      token,
      data: { 
        user: { 
          id: user._id, 
          username: user.username 
        } 
      }
    });
    
  } catch (error) {
    console.error('🚨 Registration error:', error.message);
    console.error(error.stack);
    
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.username);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password'
      });
    }

    // Check password
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    
    if (!isPasswordCorrect) {
      console.log('❌ Incorrect password for user:', username);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password'
      });
    }

    const token = signToken(user._id);

    console.log('✅ Login successful:', username);
    
    res.status(200).json({
      status: 'success',
      token,
      data: { 
        user: { 
          id: user._id, 
          username: user.username 
        } 
      }
    });
    
  } catch (error) {
    console.error('🚨 Login error:', error.message);
    
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

module.exports = router;