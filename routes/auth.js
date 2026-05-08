const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'axsem_fallback_secret_change_in_production';

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many setup attempts, please try again in 15 minutes' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes' }
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.post('/super-admin/setup', setupLimiter, async (req, res) => {
  try {
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      return res.status(403).json({ success: false, message: 'Super admin already exists. This endpoint is permanently locked.' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' });
    }

    const admin = new Admin({
      email: email.toLowerCase().trim(),
      passwordHash: password,
      name: name.trim()
    });

    await admin.save();

    const token = jwt.sign(
      { email: admin.email, name: admin.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Super admin created successfully',
      token,
      user: { email: admin.email, name: admin.name, role: 'admin' }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create super admin' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await admin.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: admin.email, name: admin.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: { email: admin.email, name: admin.name, role: 'admin' }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters with uppercase, lowercase, number, and special character' });
  }

  try {
    const admin = await Admin.findOne({ email: req.user.email });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isValid = await admin.comparePassword(currentPassword);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.passwordHash = newPassword;
    await admin.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

router.post('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;

module.exports.JWT_SECRET = JWT_SECRET;
