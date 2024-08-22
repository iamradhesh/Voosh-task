const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Adjust the path based on your project structure

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// Google login route
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // Validate the token (this is a placeholder; in practice, you would verify with Google's API)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ googleId: decoded.sub });

    if (!user) {
      user = new User({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error during Google login:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

module.exports = router;
