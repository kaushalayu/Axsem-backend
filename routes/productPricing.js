const express = require('express');
const router = express.Router();
const ProductPricing = require('../models/ProductPricing');

const seedProductPricing = [
  {
    productId: "tour-booking",
    productName: "Tour Booking Software",
    route: "/products/tour-booking",
    color: "#f05a28",
    tiers: [
      { name: "Starter", price: "₹2,999", per: "/month", desc: "1 branch · 3 users", features: ["Package management", "Booking & invoicing", "Basic reports", "Email support"], highlight: false },
      { name: "Growth", price: "₹6,499", per: "/month", desc: "3 branches · 10 users", features: ["Everything in Starter", "GST filing module", "WhatsApp integration", "Agent portal", "Priority support"], highlight: true },
      { name: "Enterprise", price: "Custom", per: "", desc: "Unlimited branches", features: ["Everything in Growth", "Custom integrations", "Dedicated manager", "SLA guarantee", "On-premise option"], highlight: false },
    ]
  },
  {
    productId: "ai-solutions",
    productName: "AI Solutions",
    route: "/products/ai-solutions",
    color: "#6b3fa0",
    tiers: [
      { name: "Starter", price: "₹4,999", per: "/month", desc: "5 automations", features: ["5 active workflows", "Document parser (100/mo)", "Basic chatbot", "Email support"], highlight: false },
      { name: "Scale", price: "₹14,999", per: "/month", desc: "Unlimited automations", features: ["Unlimited workflows", "Document parser (unlimited)", "Custom AI chatbot", "50+ integrations", "Onboarding support"], highlight: true },
      { name: "Enterprise", price: "Custom", per: "", desc: "Custom AI models", features: ["Custom-trained models", "On-premise option", "Full API access", "Enterprise SLA", "24×7 support"], highlight: false },
    ]
  },
  {
    productId: "school-management",
    productName: "School Management Software",
    route: "/products/school-management",
    color: "#0e9e6e",
    tiers: [
      { name: "Small", price: "₹1,999", per: "/month", desc: "Up to 300 students", features: ["Admissions & fee module", "Attendance tracking", "Basic reports", "WhatsApp updates"], highlight: false },
      { name: "Standard", price: "₹4,499", per: "/month", desc: "Up to 1,000 students", features: ["Everything in Small", "Parent mobile app", "Report card generator", "Timetable module", "Priority support"], highlight: true },
      { name: "Premium", price: "₹8,999", per: "/month", desc: "Unlimited students", features: ["Everything in Standard", "Biometric integration", "Custom branding", "Multi-branch", "Dedicated manager"], highlight: false },
    ]
  },
  {
    productId: "hr-payroll",
    productName: "HR & Payroll Software",
    route: "/products/hr-payroll",
    color: "#e63b2a",
    tiers: [
      { name: "Basic", price: "₹49", per: "/user/mo", desc: "Teams up to 50", features: ["Payroll processing", "Leave management", "Attendance tracking", "Payslip generation"], highlight: false },
      { name: "Pro", price: "₹89", per: "/user/mo", desc: "Teams up to 500", features: ["Everything in Basic", "PF/ESI/TDS auto filing", "Self-service portal", "Appraisal module", "API access"], highlight: true },
      { name: "Enterprise", price: "₹129", per: "/user/mo", desc: "500+ employees", features: ["Everything in Pro", "Custom workflows", "Biometric integration", "HRMS consultant", "SLA guarantee"], highlight: false },
    ]
  },
  {
    productId: "ngo",
    productName: "NGO Management Software",
    route: "/products/ngo",
    color: "#3d3d9e",
    tiers: [
      { name: "Basic", price: "₹1,499", per: "/month", desc: "Up to 500 donors", features: ["Donor management", "Donation tracking", "Basic reports", "Email support"], highlight: false },
      { name: "Standard", price: "₹3,999", per: "/month", desc: "Unlimited donors", features: ["Everything in Basic", "FCRA compliance module", "80G certificate automation", "Project tracking", "Priority support"], highlight: true },
      { name: "Premium", price: "₹7,499", per: "/month", desc: "Multiple branches", features: ["Everything in Standard", "Multi-branch NGO", "Custom reports", "Volunteer portal", "Dedicated manager"], highlight: false },
    ]
  },
  {
    productId: "hotel-booking",
    productName: "Hotel Management Software",
    route: "/products/hotel-booking",
    color: "#f05a28",
    tiers: [
      { name: "Small", price: "₹2,499", per: "/month", desc: "Up to 20 rooms", features: ["Front desk module", "Booking management", "Basic billing", "Email support"], highlight: false },
      { name: "Standard", price: "₹5,499", per: "/month", desc: "Up to 60 rooms", features: ["Everything in Small", "OTA channel manager", "Restaurant POS", "Housekeeping app", "GST billing"], highlight: true },
      { name: "Full Suite", price: "₹9,999", per: "/month", desc: "Unlimited rooms", features: ["Everything in Standard", "Multi-property", "Custom reports", "Guest CRM", "Dedicated support"], highlight: false },
    ]
  },
  {
    productId: "food-delivery",
    productName: "Restaurant POS & Delivery",
    route: "/products/food-delivery",
    color: "#e63b2a",
    tiers: [
      { name: "Starter", price: "₹1,499", per: "/month", desc: "1 outlet", features: ["POS terminal", "Table management", "KOT printing", "Daily sales reports"], highlight: false },
      { name: "Pro", price: "₹3,499", per: "/month", desc: "Up to 3 outlets", features: ["Everything in Starter", "Delivery integration", "Inventory module", "Staff management", "GST billing"], highlight: true },
      { name: "Chain", price: "₹7,999", per: "/month", desc: "Unlimited outlets", features: ["Everything in Pro", "Central dashboard", "Recipe management", "Loyalty program", "Dedicated support"], highlight: false },
    ]
  },
  {
    productId: "real-estate",
    productName: "Real Estate CRM",
    route: "/products/real-estate",
    color: "#6b3fa0",
    tiers: [
      { name: "Broker", price: "₹1,999", per: "/month", desc: "1 user · 50 leads/mo", features: ["CRM pipeline", "Lead management", "Site visit tracking", "Basic reports"], highlight: false },
      { name: "Builder", price: "₹7,999", per: "/month", desc: "10 users · unlimited leads", features: ["Everything in Broker", "Payment schedule", "Document management", "Commission tracking", "Portal integrations"], highlight: true },
      { name: "Enterprise", price: "Custom", per: "", desc: "Large builders & groups", features: ["Everything in Builder", "Multi-project", "Custom reports", "API access", "Dedicated manager"], highlight: false },
    ]
  },
  {
    productId: "crm",
    productName: "CRM Software",
    route: "/products/crm",
    color: "#0e9e6e",
    tiers: [
      { name: "Starter", price: "₹999", per: "/user/mo", desc: "Up to 5 users", features: ["Lead management", "Pipeline tracking", "Basic automation", "Email support"], highlight: false },
      { name: "Team", price: "₹1,799", per: "/user/mo", desc: "Up to 25 users", features: ["Everything in Starter", "Quotation builder", "Follow-up sequences", "WhatsApp integration", "Manager analytics"], highlight: true },
      { name: "Scale", price: "₹2,499", per: "/user/mo", desc: "Unlimited users", features: ["Everything in Team", "Custom fields & stages", "API access", "Advanced reports", "Priority support"], highlight: false },
    ]
  },
  {
    productId: "lms",
    productName: "LMS Software",
    route: "/products/lms",
    color: "#3d3d9e",
    tiers: [
      { name: "Starter", price: "₹1,999", per: "/month", desc: "Up to 100 students", features: ["Course management", "Video hosting", "Quiz builder", "Basic reports"], highlight: false },
      { name: "Pro", price: "₹4,999", per: "/month", desc: "Up to 1,000 students", features: ["Everything in Starter", "Live classes", "Certificate generator", "Payment gateway", "Mobile app"], highlight: true },
      { name: "Enterprise", price: "Custom", per: "", desc: "Unlimited students", features: ["Everything in Pro", "White-label", "Custom domain", "API access", "Dedicated support"], highlight: false },
    ]
  },
  {
    productId: "ecommerce",
    productName: "E-Commerce Platform",
    route: "/products/ecommerce",
    color: "#f05a28",
    tiers: [
      { name: "Starter", price: "₹2,999", per: "/month", desc: "Up to 100 products", features: ["Product management", "Payment gateway", "Order management", "Basic reports"], highlight: false },
      { name: "Growth", price: "₹7,999", per: "/month", desc: "Up to 1,000 products", features: ["Everything in Starter", "Inventory management", "Coupon & offers", "Email marketing", "Multi-user"], highlight: true },
      { name: "Enterprise", price: "Custom", per: "", desc: "Unlimited products", features: ["Everything in Growth", "Multi-vendor", "POS integration", "Mobile app", "Dedicated support"], highlight: false },
    ]
  },
];

router.get('/', async (req, res) => {
  try {
    const pricing = await ProductPricing.find({ isActive: true });
    if (pricing.length === 0) {
      await ProductPricing.insertMany(seedProductPricing);
      return res.json(seedProductPricing);
    }
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const pricing = await ProductPricing.findOne({ productId: req.params.productId, isActive: true });
    if (!pricing) return res.status(404).json({ message: 'Product pricing not found' });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:productId', async (req, res) => {
  try {
    const pricing = await ProductPricing.findOneAndUpdate(
      { productId: req.params.productId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(pricing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    await ProductPricing.deleteMany({});
    await ProductPricing.insertMany(seedProductPricing);
    res.json({ message: 'Product pricing seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
