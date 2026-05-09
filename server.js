const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });
connectDB();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Force HTTPS in production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

app.use(helmet({
  contentSecurityPolicy: isProduction ? true : false,
  crossOriginEmbedderPolicy: false
}));

app.use(morgan(isProduction ? 'combined' : 'dev'));

app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL || 'https://yourdomain.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Sanitization middleware - prevents XSS attacks
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    }
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Axsem API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/team', require('./routes/team'));
app.use('/api/journey', require('./routes/journey'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/companyinfo', require('./routes/companyinfo'));
app.use('/api/services', require('./routes/services'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/product-pricing', require('./routes/productPricing'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/support-tickets', require('./routes/supportTickets'));
app.use('/api/navbar', require('./routes/navbar'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/products', require('./routes/products'));
app.use('/api/techstack', require('./routes/techstack'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/portfolio', require('./routes/portfolio'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
