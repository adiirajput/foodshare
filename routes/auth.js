const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, role });
    req.session.user = { id: user._id, name: user.name, role: user.role, email: user.email };
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
    req.session.user = { id: user._id, name: user.name, role: user.role, email: user.email };
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
// Temporary admin setup route - ek baar use karo
router.get('/setup-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ email: 'admin@foodshare.com' });
    if (exists) return res.json({ message: 'Admin already exists!' });
    await User.create({
      name: 'Admin',
      email: 'admin@foodshare.com',
      password: 'admin123',
      role: 'admin'
    });
    res.json({ message: 'Admin created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;