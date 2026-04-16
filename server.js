const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });
connectDB();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Seed endpoint for projects
app.post('/api/seed/projects', async (req, res) => {
  const Project = require('./models/Project');
  
  const sampleProjects = [
    {
      id: "ecommerce-platform",
      title: "E-Commerce Platform",
      tagline: "A full-featured online shopping platform with payment gateway integration",
      category: "Web App",
      tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
      color: "#f05a28",
      year: "2024",
      duration: "4 months",
      client: "RetailMax",
      industry: "E-Commerce",
      status: "Live",
      featured: true,
      overview: "A comprehensive e-commerce platform enabling businesses to sell products online with inventory management, order processing, and secure payments.",
      description: "We built a modern e-commerce platform with a focus on user experience, performance, and scalability. The platform includes a dynamic product catalog, shopping cart, checkout process, payment integration, order management, and admin dashboard.",
      challenge: "The client needed a scalable solution that could handle high traffic during sales events while providing a seamless shopping experience. They also required integration with multiple payment gateways and inventory management systems.",
      solution: "We developed a microservices-based architecture using React for frontend and Node.js for backend. Implemented caching with Redis, CDN for static assets, and optimized database queries. Integrated Stripe and PayPal for payments.",
      results: [
        { metric: "99.9%", label: "Uptime" },
        { metric: "40%", label: "Conversion Rate" },
        { metric: "3x", label: "Faster Load Time" },
        { metric: "10K+", label: "Monthly Users" }
      ],
      techStack: [
        { category: "Frontend", items: ["React", "Redux", "Tailwind CSS", "TypeScript"] },
        { category: "Backend", items: ["Node.js", "Express", "MongoDB"] },
        { category: "Payments", items: ["Stripe", "PayPal"] },
        { category: "DevOps", items: ["AWS", "Docker", "Nginx"] }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
      ],
      links: {
        live: "https://example.com",
        github: "https://github.com"
      },
      testimonial: {
        quote: "AXSEM delivered an exceptional e-commerce platform that exceeded our expectations.",
        author: "John Smith",
        role: "CEO, RetailMax"
      }
    },
    {
      id: "healthcare-app",
      title: "Healthcare Mobile App",
      tagline: "Telemedicine app connecting patients with doctors for virtual consultations",
      category: "Mobile App",
      tags: ["React Native", "Firebase", "Node.js", "AWS"],
      color: "#3d3d9e",
      year: "2024",
      duration: "6 months",
      client: "HealthFirst",
      industry: "Healthcare",
      status: "Live",
      featured: true,
      overview: "A comprehensive telemedicine application enabling patients to book appointments, consult doctors virtually, and manage their health records.",
      description: "This healthcare app provides telemedicine services allowing patients to connect with doctors through video calls, chat, and appointment scheduling. Includes patient records management, prescription tracking, and medication reminders.",
      challenge: "The healthcare industry required a HIPAA-compliant solution with secure video conferencing, real-time chat, and integration with existing hospital management systems.",
      solution: "We built a HIPAA-compliant mobile app using React Native for cross-platform support. Implemented WebRTC for video calls, end-to-end encryption for messages, and integrated with Twilio for communication.",
      results: [
        { metric: "50K+", label: "Downloads" },
        { metric: "4.8", label: "App Rating" },
        { metric: "95%", label: "Patient Satisfaction" },
        { metric: "30%", label: "Reduced No-Shows" }
      ],
      techStack: [
        { category: "Mobile", items: ["React Native", "Expo"] },
        { category: "Backend", items: ["Node.js", "Express", "Firebase"] },
        { category: "Communication", items: ["WebRTC", "Twilio"] },
        { category: "Cloud", items: ["AWS", "Google Cloud"] }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"
      ],
      links: {
        live: "https://example.com",
        github: ""
      },
      testimonial: {
        quote: "The app has transformed how we deliver healthcare services to our patients.",
        author: "Dr. Sarah Johnson",
        role: "Medical Director, HealthFirst"
      }
    },
    {
      id: "school-management",
      title: "School Management System",
      tagline: "Complete ERP solution for educational institutions",
      category: "Web App",
      tags: ["React", "Python", "PostgreSQL", "Django"],
      color: "#0e9e6e",
      year: "2023",
      duration: "8 months",
      client: "EduTech Solutions",
      industry: "Education",
      status: "Live",
      featured: true,
      overview: "A comprehensive school management system handling student information, attendance, grades, fees, and communication.",
      description: "We developed a full-featured ERP system for schools that automates administrative tasks, improves communication between teachers, students, and parents, and provides valuable analytics.",
      challenge: "The client needed to digitize all school operations including admission, attendance, examination, fee collection, and library management while ensuring data security.",
      solution: "Built a comprehensive Django-based backend with React frontend. Implemented role-based access control, automated notifications, and detailed reporting modules.",
      results: [
        { metric: "80%", label: "Reduced Paperwork" },
        { metric: "60%", label: "Faster Administration" },
        { metric: "100+", label: "Schools Using" },
        { metric: "25K+", label: "Students" }
      ],
      techStack: [
        { category: "Frontend", items: ["React", "Material UI"] },
        { category: "Backend", items: ["Python", "Django", "PostgreSQL"] },
        { category: "Security", items: ["JWT", "BCrypt"] },
        { category: "Deployment", items: ["Docker", "AWS"] }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
      ],
      links: {
        live: "https://example.com",
        github: ""
      }
    },
    {
      id: "restaurant-app",
      title: "Restaurant Management",
      tagline: "POS system and table management for restaurants",
      category: "Mobile App",
      tags: ["Flutter", "Firebase", "Node.js"],
      color: "#e63b2a",
      year: "2024",
      duration: "3 months",
      client: "FoodieHub",
      industry: "Food & Beverage",
      status: "Live",
      featured: false,
      overview: "A complete restaurant management solution with POS, table reservation, and kitchen display system.",
      description: "An all-in-one restaurant management app that handles order taking, kitchen display, table management, and billing. Includes inventory tracking and staff management.",
      challenge: "The restaurant needed a fast, intuitive system that could handle rush hours without downtime and integrate with their existing inventory system.",
      solution: "Created a Flutter-based cross-platform app with Firebase for real-time updates. Implemented offline mode and instant synchronization for uninterrupted service.",
      results: [
        { metric: "2x", label: "Faster Service" },
        { metric: "30%", label: "Cost Savings" },
        { metric: "4.9", label: "User Rating" },
        { metric: "50+", label: "Restaurants" }
      ],
      techStack: [
        { category: "Mobile", items: ["Flutter", "Dart"] },
        { category: "Backend", items: ["Node.js", "Firebase"] },
        { category: "Database", items: ["MongoDB"] }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
      ],
      links: {
        live: "https://example.com",
        github: ""
      }
    },
    {
      id: "real-estate-platform",
      title: "Real Estate Platform",
      tagline: "Property listing and management platform for real estate agents",
      category: "Web App",
      tags: ["Next.js", "Prisma", "PostgreSQL", "AWS"],
      color: "#6b3fa0",
      year: "2024",
      duration: "5 months",
      client: "PropertyPro",
      industry: "Real Estate",
      status: "Live",
      featured: true,
      overview: "A modern real estate platform for property listings, virtual tours, and lead management.",
      description: "Full-featured real estate platform with property listings, advanced search, virtual tours, lead management, and agent dashboards. Includes SEO optimization and marketing tools.",
      challenge: "The client wanted a platform that could handle thousands of listings with fast search, virtual tour integration, and powerful lead management.",
      solution: "Built with Next.js for SEO, Prisma for type-safe database operations. Implemented Elasticsearch for fast search, integrated Matterport for virtual tours, and built a custom CRM for lead management.",
      results: [
        { metric: "80%", label: "Faster Search" },
        { metric: "3x", label: "Lead Generation" },
        { metric: "500+", label: "Properties" },
        { metric: "200+", label: "Agents" }
      ],
      techStack: [
        { category: "Frontend", items: ["Next.js", "Tailwind CSS", "TypeScript"] },
        { category: "Backend", items: ["Node.js", "Prisma", "PostgreSQL"] },
        { category: "Search", items: ["Elasticsearch"] },
        { category: "Virtual Tours", items: ["Matterport"] }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
      ],
      links: {
        live: "https://example.com",
        github: ""
      },
      testimonial: {
        quote: "Our sales have increased significantly since launching on this platform.",
        author: "Michael Brown",
        role: "Director, PropertyPro"
      }
    }
  ];
  
  try {
    // Clear existing projects and add new ones
    await Project.deleteMany({});
    await Project.insertMany(sampleProjects);
    res.json({ message: "Sample projects added successfully", count: sampleProjects.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// Seed endpoint for products
app.post('/api/seed/products', async (req, res) => {
  const Product = require('./models/Product');
  const sampleProducts = [
    { name: 'TripAxis', tagline: 'Tour & Travel Management', description: 'End-to-end booking, itinerary, billing & GST filing', icon: 'FiMap', color: '#f05a28', category: 'Industry', tag: '50+ Agencies', path: '/products/tour-booking', order: 0, isActive: true },
    { name: 'AxsemAI', tagline: 'AI-Powered Automation', description: 'Automate tasks, parse documents & generate insights with AI', icon: 'FiCpu', color: '#6b3fa0', category: 'Business', tag: '30+ Automations', path: '/products/ai-solutions', order: 1, isActive: true },
    { name: 'SchoolAxis', tagline: 'School Management System', description: 'Admissions, attendance, fee collection & report cards', icon: 'FiBookOpen', color: '#0e9e6e', category: 'Education', tag: '15k+ Students', path: '/products/school-management', order: 2, isActive: true },
    { name: 'PeopleAxis', tagline: 'HR & Payroll System', description: 'PF, ESI, TDS auto-calculations with leave tracking', icon: 'FiUsers', color: '#3d3d9e', category: 'Business', tag: '50k+ Employees', path: '/products/hr-payroll', order: 3, isActive: true },
    { name: 'NGOAxis', tagline: 'NGO Management Software', description: 'FCRA compliance, donor management & fund reporting', icon: 'FiTrendingUp', color: '#e63b2a', category: 'Industry', tag: 'FCRA Compliant', path: '/products/ngo', order: 4, isActive: true },
    { name: 'HotelAxis', tagline: 'Hotel & Property Management', description: 'Room booking, housekeeping & billing', icon: 'FiHome', color: '#f5a623', category: 'Industry', tag: '40+ Properties', path: '/products/real-estate', order: 5, isActive: true },
    { name: 'FoodAxis', tagline: 'Restaurant Platform', description: 'POS, KOT, table management & GST billing', icon: 'FiCoffee', color: '#e63b2a', category: 'Industry', tag: '60+ Restaurants', path: '/products/ecommerce', order: 6, isActive: true },
    { name: 'LearnAxis', tagline: 'Learning Management System', description: 'Course builder, live classes & progress analytics', icon: 'FiBookOpen', color: '#0e9e6e', category: 'Education', tag: '50k+ Students', path: '/products/lms', order: 7, isActive: true },
    { name: 'ShopAxis', tagline: 'E-Commerce Platform', description: 'Multi-vendor store, payment gateway & inventory', icon: 'FiShoppingBag', color: '#f05a28', category: 'Business', tag: '100+ Stores', path: '/products/ecommerce', order: 8, isActive: true },
    { name: 'CRMAxis', tagline: 'CRM for Sales Teams', description: 'Pipeline, follow-ups & performance dashboard', icon: 'FiBriefcase', color: '#6b3fa0', category: 'Business', tag: '300+ Sales Teams', path: '/products/crm', order: 9, isActive: true },
  ];
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    res.json({ success: true, message: 'Products seeded', count: sampleProducts.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed endpoint for techstack
app.post('/api/seed/techstack', async (req, res) => {
  const TechStack = require('./models/TechStack');
  const sampleTechs = [
    { name: 'React', category: 'Frontend', color: '#61DAFB', order: 0, isActive: true },
    { name: 'Next.js', category: 'Frontend', color: '#000000', order: 1, isActive: true },
    { name: 'Vue.js', category: 'Frontend', color: '#4FC08D', order: 2, isActive: true },
    { name: 'Tailwind CSS', category: 'Frontend', color: '#38B2AC', order: 3, isActive: true },
    { name: 'TypeScript', category: 'Frontend', color: '#3178C6', order: 4, isActive: true },
    { name: 'Flutter', category: 'Mobile', color: '#02569B', order: 5, isActive: true },
    { name: 'React Native', category: 'Mobile', color: '#61DAFB', order: 6, isActive: true },
    { name: 'Swift', category: 'Mobile', color: '#F05138', order: 7, isActive: true },
    { name: 'Kotlin', category: 'Mobile', color: '#3DDC84', order: 8, isActive: true },
    { name: 'Node.js', category: 'Backend', color: '#339933', order: 9, isActive: true },
    { name: 'Python', category: 'Backend', color: '#3776AB', order: 10, isActive: true },
    { name: 'Django', category: 'Backend', color: '#092E20', order: 11, isActive: true },
    { name: 'Laravel', category: 'Backend', color: '#FF2D20', order: 12, isActive: true },
    { name: 'Go', category: 'Backend', color: '#00ADD8', order: 13, isActive: true },
    { name: 'PostgreSQL', category: 'Database', color: '#336791', order: 14, isActive: true },
    { name: 'MySQL', category: 'Database', color: '#4479A1', order: 15, isActive: true },
    { name: 'MongoDB', category: 'Database', color: '#47A248', order: 16, isActive: true },
    { name: 'Redis', category: 'Database', color: '#DC382D', order: 17, isActive: true },
    { name: 'Firebase', category: 'Database', color: '#FFCA28', order: 18, isActive: true },
    { name: 'AWS', category: 'Cloud', color: '#FF9900', order: 19, isActive: true },
    { name: 'GCP', category: 'Cloud', color: '#4285F4', order: 20, isActive: true },
    { name: 'Docker', category: 'DevOps', color: '#2496ED', order: 21, isActive: true },
    { name: 'Kubernetes', category: 'DevOps', color: '#326CE5', order: 22, isActive: true },
    { name: 'ChatGPT', category: 'AI/ML', color: '#74AA9C', order: 23, isActive: true },
    { name: 'TensorFlow', category: 'AI/ML', color: '#FF6F00', order: 24, isActive: true },
    { name: 'PyTorch', category: 'AI/ML', color: '#EE4C2C', order: 25, isActive: true },
  ];
  try {
    await TechStack.deleteMany({});
    await TechStack.insertMany(sampleTechs);
    res.json({ success: true, message: 'TechStack seeded', count: sampleTechs.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed endpoint for testimonials
app.post('/api/seed/testimonials', async (req, res) => {
  const Testimonial = require('./models/Testimonial');
  const sampleTestimonials = [
    { name: 'Rajesh Sharma', role: 'CEO, RetailFlow Pvt Ltd', color: '#f05a28', rating: 5, review: 'AXSEM completely transformed our operations. The ERP system they built reduced our billing time by 60% and gave us real-time visibility across all 12 stores. Truly outstanding team.', type: 'text', location: 'Delhi, India', order: 0, isActive: true },
    { name: 'Priya Mehta', role: 'Founder, SwiftDeliver', color: '#3d3d9e', rating: 5, review: 'We launched our delivery app in just 3 months — on time, within budget, and with zero critical bugs. The Flutter app performs flawlessly on both iOS and Android. Highly recommend AXSEM.', type: 'text', location: 'Mumbai, India', order: 1, isActive: true },
    { name: 'Amit Verma', role: 'CTO, HireBoard Technologies', color: '#6b3fa0', rating: 5, review: 'What impressed me most was their technical depth. They implemented AI resume parsing from scratch, and the system now processes 500+ applications per day without any issues.', type: 'text', location: 'Bangalore, India', order: 2, isActive: true },
    { name: 'Sneha Gupta', role: 'Director, EduTech Solutions', color: '#0e9e6e', rating: 5, review: 'Our LMS platform built by AXSEM has 50,000+ active users. The performance and user experience are exceptional. Great team to work with!', type: 'text', location: 'Hyderabad, India', order: 3, isActive: true },
    { name: 'Vikram Singh', role: 'Owner, HotelChain', color: '#f5a623', rating: 5, review: 'The hotel management system transformed our operations. Online bookings increased by 40% after the new system launch. Highly satisfied!', type: 'text', location: 'Jaipur, India', order: 4, isActive: true },
  ];
  try {
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(sampleTestimonials);
    res.json({ success: true, message: 'Testimonials seeded', count: sampleTestimonials.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed endpoint for navbar links
app.post('/api/seed/navbar', async (req, res) => {
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
app.post('/api/seed/footer', async (req, res) => {
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
app.post('/api/seed/partners', async (req, res) => {
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
