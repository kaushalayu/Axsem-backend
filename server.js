const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors());
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
