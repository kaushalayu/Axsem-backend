const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'axsem-admin-secret-key-2024';

const adminCredentials = {
  email: process.env.ADMIN_EMAIL || 'admin@axsem.com',
  password: process.env.ADMIN_PASSWORD || 'Axsem@123',
  name: 'Admin'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === adminCredentials.email && password === adminCredentials.password) {
    const token = jwt.sign(
      { email: adminCredentials.email, name: adminCredentials.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ 
      success: true, 
      token, 
      user: { email: adminCredentials.email, name: adminCredentials.name } 
    });
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
