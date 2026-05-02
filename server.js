const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult, param, query } = require('express-validator');
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

app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL || 'https://yourdomain.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Seed endpoints disabled in production
const disableInProduction = (req, res, next) => {
  if (isProduction) {
    return res.status(410).json({ success: false, message: 'This endpoint is disabled in production' });
  }
  next();
};

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message
  });
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

// Request validation helper
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

app.post('/api/seed/projects', disableInProduction, (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled.' });
});

app.use('/api/team', require('./routes/team'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/companyinfo', require('./routes/companyinfo'));
app.use('/api/services', require('./routes/services'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/product-pricing', require('./routes/productPricing'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/support-tickets', require('./routes/supportTickets'));
app.use('/api/navbar', require('./routes/navbar'));
app.use('/api/products', require('./routes/products'));
app.use('/api/techstack', require('./routes/techstack'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/portfolio', require('./routes/portfolio'));

// Seed endpoints - disabled in production (seed.js file deleted)
// app.use('/api/seed', disableInProduction, require('./seed'));

app.post('/api/seed/navbar-dynamic', disableInProduction, (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled. Use admin panel to add links manually.' });
});

// Seed endpoint for pages
app.post('/api/seed/pages', disableInProduction, async (req, res) => {
  const Page = require('./models/Page');
  const samplePages = [
    {
      slug: '/services/web-development',
      title: 'Web Development Services',
      template: 'service',
      status: 'published',
      seo: { title: 'Professional Web Development Services', description: 'Get custom web development services. Modern, responsive, and SEO-friendly websites.', keywords: 'web development, website design, custom website' },
      hero: { heading: 'Professional Web Development', subheading: 'We build modern, responsive, and high-performance websites that drive results.', ctaText: 'Get a Quote', ctaLink: '/contact', enabled: true },
      sections: [
        { type: 'features', title: 'Our Web Development Services', enabled: true, order: 0, content: { items: [{ title: 'Custom Development', description: 'Tailored solutions built for your specific business needs.', icon: 'code' }, { title: 'E-Commerce Solutions', description: 'Full-featured online stores with payment integration.', icon: 'shopping-cart' }, { title: 'CMS Integration', description: 'Easy content management with WordPress or custom CMS.', icon: 'file-text' }, { title: 'API Development', description: 'Custom APIs and third-party integrations.', icon: 'link' }] } },
        { type: 'stats', title: 'Our Impact', enabled: true, order: 1, content: { items: [{ metric: '500+', label: 'Websites Delivered' }, { metric: '98%', label: 'Client Satisfaction' }, { metric: '50+', label: 'Team Members' }, { metric: '10+', label: 'Years Experience' }] } },
        { type: 'faq', title: 'Frequently Asked Questions', enabled: true, order: 2, content: { items: [{ question: 'How long does it take to build a website?', answer: 'Timeline depends on complexity. A standard website takes 2-4 weeks.' }, { question: 'Do you provide post-launch support?', answer: 'Yes, we offer 6 months of free support and maintenance.' }, { question: 'Can I update content myself?', answer: 'Yes, we provide a user-friendly CMS for easy content updates.' }] } },
        { type: 'cta', title: 'Ready to Build Your Website?', enabled: true, order: 3, content: {} }
      ],
      content: { description: 'We deliver high-quality web development services tailored to your business needs.', body: '<p>Our team of expert developers uses the latest technologies to build modern, responsive, and SEO-friendly websites.</p><h3>Why Choose Us?</h3><ul><li>Experienced developers</li><li>Modern technologies</li><li>On-time delivery</li><li>Post-launch support</li></ul>' }
    },
    {
      slug: '/services/mobile-apps',
      title: 'Mobile App Development',
      template: 'service',
      status: 'published',
      seo: { title: 'Mobile App Development Services', description: 'Build native and cross-platform mobile apps for iOS and Android.', keywords: 'mobile app development, iOS app, Android app' },
      hero: { heading: 'Mobile App Development', subheading: 'We create feature-rich mobile apps for iOS and Android platforms.', ctaText: 'Get a Quote', ctaLink: '/contact', enabled: true },
      sections: [
        { type: 'features', title: 'Our Mobile Services', enabled: true, order: 0, content: { items: [{ title: 'iOS Development', description: 'Native iPhone and iPad apps using Swift.' }, { title: 'Android Development', description: 'Native Android apps using Kotlin.' }, { title: 'Cross-Platform', description: 'React Native and Flutter apps for both platforms.' }] } },
        { type: 'cta', title: 'Start Your Mobile Project', enabled: true, order: 1, content: {} }
      ],
      content: { description: 'Professional mobile app development services.', body: '' }
    },
    {
      slug: '/services/digital-marketing',
      title: 'Digital Marketing Services',
      template: 'service',
      status: 'published',
      seo: { title: 'Digital Marketing Services', description: 'Grow your business with our digital marketing services.', keywords: 'digital marketing, SEO, social media marketing' },
      hero: { heading: 'Digital Marketing Services', subheading: 'We help businesses grow with data-driven marketing strategies.', ctaText: 'Get Started', ctaLink: '/contact', enabled: true },
      sections: [
        { type: 'features', title: 'Our Marketing Services', enabled: true, order: 0, content: { items: [{ title: 'SEO', description: 'Improve your search engine rankings.' }, { title: 'Social Media', description: 'Build your brand on social platforms.' }, { title: 'PPC', description: 'Targeted advertising campaigns.' }] } },
        { type: 'cta', title: 'Grow Your Business', enabled: true, order: 1, content: {} }
      ],
      content: { description: 'Expert digital marketing services.', body: '' }
    }
  ];
  try {
    await Page.deleteMany({});
    await Page.insertMany(samplePages);
    res.json({ success: true, message: 'Pages seeded', count: samplePages.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed endpoint for footer (DISABLED - Deletes all data!)
// To re-enable, uncomment below but be careful - this DELETES all existing links
// app.post('/api/seed/footer-dynamic', async (req, res) => {
//   const FooterLink = require('./models/FooterLink');
//   const sampleFooterLinks = [ ... ];
//   try {
//     await FooterLink.deleteMany({});
//     await FooterLink.insertMany(sampleFooterLinks);
//     res.json({ success: true, message: 'Footer links seeded', count: sampleFooterLinks.length });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

app.post('/api/seed/footer-dynamic', (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled. Use admin panel to add links manually.' });
});

// Master seed - seeds all at once (DISABLED - Deletes ALL data!)
// app.post('/api/seed/all', async (req, res) => {
//   const results = [];
//   try {

app.post('/api/seed/all', (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled.' });
});

// Seed endpoint for products (DISABLED)
// app.post('/api/seed/products', async (req, res) => {
//   const Product = require('./models/Product');
//   const sampleProducts = [ ... ];
//   try {
//     await Product.deleteMany({});
//     await Product.insertMany(sampleProducts);
//     res.json({ success: true, message: 'Products seeded', count: sampleProducts.length });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

app.post('/api/seed/products', (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled.' });
});

// Seed endpoint for techstack (DISABLED)
// app.post('/api/seed/techstack', async (req, res) => {
//   const TechStack = require('./models/TechStack');
//   const sampleTechs = [ ... ];
//   try {
//     await TechStack.deleteMany({});
//     await TechStack.insertMany(sampleTechs);
//     res.json({ success: true, message: 'Tech stack seeded', count: sampleTechs.length });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

app.post('/api/seed/techstack', (req, res) => {
  res.status(410).json({ success: false, message: 'This endpoint has been disabled.' });
});

// Seed endpoint for navbar links
app.post('/api/seed/navbar', disableInProduction, async (req, res) => {
  const NavbarLink = require('./models/NavbarLink');
  
  const sampleNavbarLinks = [
    { label: 'Home', path: '/', order: 0, section: 'main', isActive: true },
    { label: 'About', path: '/about', order: 1, section: 'main', isActive: true },
    { label: 'Services', path: '/services', order: 2, section: 'main', hasDropdown: true, isActive: true },
    { label: 'Products', path: '/products', order: 3, section: 'main', isActive: true },
    { label: 'Pricing', path: '/pricing', order: 4, section: 'main', isActive: true },
    { label: 'Portfolio', path: '/portfolio', order: 5, section: 'main', isActive: true },
    { label: 'Career', path: '/careers', order: 6, section: 'main', isActive: true },
    { label: 'Contact', path: '/contact', order: 7, section: 'main', isActive: true },
  ];
  
  try {
    await NavbarLink.deleteMany({});
    await NavbarLink.insertMany(sampleNavbarLinks);
    res.json({ message: "Sample navbar links added successfully", count: sampleNavbarLinks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed endpoint for footer links
app.post('/api/seed/footer', disableInProduction, async (req, res) => {
  const FooterLink = require('./models/FooterLink');
  
  const sampleFooterLinks = [
    // Company
    { category: 'Company', title: 'About Us', url: '/about/company', order: 0, isActive: true },
    { category: 'Company', title: 'Our Team', url: '/about/team', order: 1, isActive: true },
    { category: 'Company', title: 'Careers', url: '/about/careers', order: 2, isActive: true },
    { category: 'Company', title: 'Contact Us', url: '/contact', order: 3, isActive: true },
    // Services
    { category: 'Services', title: 'Web Development', url: '/services/web-development', order: 0, isActive: true },
    { category: 'Services', title: 'Mobile Apps', url: '/services/mobile-apps', order: 1, isActive: true },
    { category: 'Services', title: 'UI/UX Design', url: '/services/ui-ux', order: 2, isActive: true },
    { category: 'Services', title: 'Digital Marketing', url: '/services/digital-marketing', order: 3, isActive: true },
    // Products
    { category: 'Products', title: 'CRM Software', url: '/products/crm', order: 0, isActive: true },
    { category: 'Products', title: 'E-Commerce', url: '/products/ecommerce', order: 1, isActive: true },
    { category: 'Products', title: 'LMS', url: '/products/lms', order: 2, isActive: true },
    { category: 'Products', title: 'School Management', url: '/products/school-management', order: 3, isActive: true },
    // Support
    { category: 'Support', title: 'Help Center', url: '/faq', order: 0, isActive: true },
    { category: 'Support', title: 'Partner Portal', url: '/partner/login', order: 1, isActive: true },
    { category: 'Support', title: 'Client Portal', url: '/client/register', order: 2, isActive: true },
    { category: 'Support', title: 'Support Ticket', url: '/support/ticket', order: 3, isActive: true },
    // Legal
    { category: 'Legal', title: 'Privacy Policy', url: '/privacy', order: 0, isActive: true },
    { category: 'Legal', title: 'Terms of Service', url: '/terms', order: 1, isActive: true },
    { category: 'Legal', title: 'Sitemap', url: '/sitemap', order: 2, isActive: true },
  ];
  
  try {
    await FooterLink.deleteMany({});
    await FooterLink.insertMany(sampleFooterLinks);
    res.json({ message: "Sample footer links added successfully", count: sampleFooterLinks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/footer', require('./routes/footer'));

// Seed endpoint for partners
app.post('/api/seed/partners', disableInProduction, async (req, res) => {
  const Partner = require('./models/Partner');
  
  const samplePartners = [
    {
      companyName: 'Tech Solutions Pvt Ltd',
      contactPerson: 'Rahul Sharma',
      email: 'partner@techsolutions.com',
      mobile: '9876543210',
      password: 'partner123',
      businessType: 'private_ltd',
      city: 'Mumbai',
      state: 'Maharashtra',
      website: 'https://techsolutions.com',
      gstin: '27AAACT1234A1ZX',
      aadharPan: 'AAETP1234A',
      partnershipAreas: ['web_development', 'mobile_apps', 'digital_marketing'],
      experience: '5+ years in IT services',
      status: 'approved',
      emailVerified: true,
      bankDetails: {
        accountHolder: 'Tech Solutions Pvt Ltd',
        accountNumber: '1234567890',
        bankName: 'HDFC Bank',
        ifsc: 'HDFC0001234',
        branch: 'Mumbai Main'
      },
      stats: {
        totalClients: 5,
        activeClients: 3,
        totalEarnings: 25000,
        pendingPayout: 5000
      }
    },
    {
      companyName: 'Digital Boost Agency',
      contactPerson: 'Priya Patel',
      email: 'partner@digitalboost.com',
      mobile: '9876543211',
      password: 'partner123',
      businessType: 'partnership',
      city: 'Bangalore',
      state: 'Karnataka',
      website: 'https://digitalboost.in',
      gstin: '29AAFD1234A1BC',
      aadharPan: 'BBETP5678B',
      partnershipAreas: ['seo', 'digital_marketing', 'consulting'],
      experience: '3+ years in digital marketing',
      status: 'approved',
      emailVerified: true,
      bankDetails: {
        accountHolder: 'Digital Boost Agency',
        accountNumber: '9876543210',
        bankName: 'ICICI Bank',
        ifsc: 'ICIC0001234',
        branch: 'Bangalore'
      },
      stats: {
        totalClients: 3,
        activeClients: 2,
        totalEarnings: 15000,
        pendingPayout: 3000
      }
    },
    {
      companyName: 'Creative Minds Studio',
      contactPerson: 'Amit Kumar',
      email: 'partner@creativeminds.com',
      mobile: '9876543212',
      password: 'partner123',
      businessType: 'proprietorship',
      city: 'Delhi',
      state: 'Delhi',
      partnershipAreas: ['design', 'web_development'],
      experience: '4+ years in design and development',
      status: 'pending',
      emailVerified: true
    }
  ];
  
  try {
    await Partner.deleteMany({});
    const partners = await Partner.insertMany(samplePartners);
    res.json({ 
      message: "Sample partners added successfully", 
      count: partners.length,
      credentials: samplePartners.map(p => ({
        email: p.email,
        password: p.password,
        status: p.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
