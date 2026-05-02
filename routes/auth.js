const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'axsem_fallback_secret_change_in_production';
const SALT_ROUNDS = 12;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes' }
});

const adminCredentials = {
  email: (process.env.ADMIN_EMAIL || 'admin@axsem.com').toLowerCase().trim(),
  passwordHash: null,
  name: 'Admin'
};

const initAdminHash = async () => {
  if (process.env.ADMIN_PASSWORD_HASH) {
    adminCredentials.passwordHash = process.env.ADMIN_PASSWORD_HASH.trim();
  } else {
    const plaintext = (process.env.ADMIN_PASSWORD || 'Axsem@123').trim();
    adminCredentials.passwordHash = await bcrypt.hash(plaintext, SALT_ROUNDS);
  }
};

// Store the promise so login route can await it if needed
const hashReady = initAdminHash();

router.post('/login', loginLimiter, async (req, res) => {
  // Wait for hash to be ready (handles race condition on cold start)
  await hashReady;

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email.toLowerCase().trim() === adminCredentials.email) {
    const isValid = await bcrypt.compare(password, adminCredentials.passwordHash);
    if (isValid) {
      const token = jwt.sign(
        { email: adminCredentials.email, name: adminCredentials.name, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ 
        success: true, 
        token, 
        user: { email: adminCredentials.email, name: adminCredentials.name, role: 'admin' } 
      });
    }
  }
  
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
