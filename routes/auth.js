const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, role, phone });
    req.session.user = { id: user._id, name: user.name, role: user.role, email: user.email, phone: user.phone };
    res.json({ success: true, user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email not found' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
req.session.user = { id: user._id, name: user.name, role: user.role, email: user.email, phone: user.phone };
    res.json({ success: true, user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// GET current user
router.get('/me', (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.status(401).json({ error: 'Not logged in' });
});
// GET all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE profile
router.put('/profile', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    const { name, phone, password } = req.body;
    const update = { name, phone };
    if (password && password.length >= 6) {
      const bcrypt = require('bcryptjs');
      update.password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(req.session.user.id, update, { new: true });
    req.session.user = { ...req.session.user, name: user.name, phone: user.phone };
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;