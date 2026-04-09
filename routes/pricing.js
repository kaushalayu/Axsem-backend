const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

const seedPricing = [
  {
    category: "Website",
    color: "#f05a28",
    plans: [
      {
        name: "Basic",
        price: "₹25,000",
        per: "one-time",
        tag: null,
        desc: "Everything you need to get your business online — clean, fast, mobile-ready.",
        features: [
          { text: "5 custom designed pages", yes: true },
          { text: "Mobile responsive design", yes: true },
          { text: "Contact form + WhatsApp button", yes: true },
          { text: "Basic on-page SEO", yes: true },
          { text: "Google Analytics setup", yes: true },
          { text: "1 month free support", yes: true },
          { text: "Blog / CMS", yes: false },
          { text: "E-commerce / payments", yes: false },
        ],
        cta: "Get Basic",
        path: "/packages/website-basic",
        highlight: false,
      },
      {
        name: "Standard",
        price: "₹50,000",
        per: "one-time",
        tag: "Most Popular",
        desc: "Full business website with CMS, advanced SEO, analytics, and lead capture.",
        features: [
          { text: "Up to 10 custom pages", yes: true },
          { text: "Full CMS — edit anything", yes: true },
          { text: "Advanced SEO + schema markup", yes: true },
          { text: "GA4 + Search Console setup", yes: true },
          { text: "Lead capture with CRM", yes: true },
          { text: "3 months free support", yes: true },
          { text: "Progressive Web App (PWA)", yes: true },
          { text: "E-commerce / payments", yes: false },
        ],
        cta: "Get Standard",
        path: "/packages/website-standard",
        highlight: true,
      },
      {
        name: "Dynamic",
        price: "₹90,000",
        per: "one-time",
        tag: null,
        desc: "Full web application — e-commerce, booking systems, user portals, and integrations.",
        features: [
          { text: "Unlimited pages", yes: true },
          { text: "E-commerce + payment gateway", yes: true },
          { text: "Booking / appointment system", yes: true },
          { text: "Multi-role user accounts", yes: true },
          { text: "Admin dashboard", yes: true },
          { text: "6 months free support", yes: true },
          { text: "Third-party integrations", yes: true },
          { text: "Cloud deployment on AWS", yes: true },
        ],
        cta: "Get Dynamic",
        path: "/packages/website-dynamic",
        highlight: false,
      },
    ],
  },
  {
    category: "Software",
    color: "#3d3d9e",
    plans: [
      {
        name: "Basic",
        price: "₹50,000",
        per: "one-time",
        tag: null,
        desc: "One well-built core module — inventory, billing, payroll, or any focused function.",
        features: [
          { text: "1 custom module", yes: true },
          { text: "Role-based user access", yes: true },
          { text: "Admin panel + dashboard", yes: true },
          { text: "Reports & CSV export", yes: true },
          { text: "REST API included", yes: true },
          { text: "2 months support", yes: true },
          { text: "Payment gateway", yes: false },
          { text: "Multi-module platform", yes: false },
        ],
        cta: "Get Basic",
        path: "/packages/basic-software",
        highlight: false,
      },
      {
        name: "Premium",
        price: "₹2,00,000",
        per: "one-time",
        tag: "Full Platform",
        desc: "Multi-module enterprise platform — ERP, CRM, SaaS — built for scale and security.",
        features: [
          { text: "Multi-module platform", yes: true },
          { text: "Multi-role & multi-branch", yes: true },
          { text: "Payment gateway integration", yes: true },
          { text: "Third-party API integrations", yes: true },
          { text: "AWS/GCP cloud deployment", yes: true },
          { text: "CI/CD + automated backups", yes: true },
          { text: "Security audit + compliance", yes: true },
          { text: "6 months dedicated support", yes: true },
        ],
        cta: "Get Premium",
        path: "/packages/premium-software",
        highlight: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        per: "quote on request",
        tag: null,
        desc: "Large-scale platforms, AI integrations, multi-tenant SaaS, and government-grade systems.",
        features: [
          { text: "Everything in Premium", yes: true },
          { text: "AI / ML integrations", yes: true },
          { text: "Multi-tenant SaaS architecture", yes: true },
          { text: "Dedicated project manager", yes: true },
          { text: "12 months support & AMC", yes: true },
          { text: "On-site training sessions", yes: true },
          { text: "Performance SLA guarantee", yes: true },
          { text: "Priority 24/7 support", yes: true },
        ],
        cta: "Get Quote",
        path: "/contact",
        highlight: false,
      },
    ],
  },
  {
    category: "SEO",
    color: "#0e9e6e",
    plans: [
      {
        name: "Basic SEO",
        price: "₹15,000",
        per: "per month",
        tag: null,
        desc: "Solid SEO foundation — technical fixes, on-page optimisation, and local visibility.",
        features: [
          { text: "10 keywords tracked", yes: true },
          { text: "Technical SEO audit", yes: true },
          { text: "On-page SEO (10 pages/mo)", yes: true },
          { text: "Google Business Profile", yes: true },
          { text: "5 backlinks per month", yes: true },
          { text: "Monthly ranking report", yes: true },
          { text: "Blog content writing", yes: false },
          { text: "15+ backlinks / month", yes: false },
        ],
        cta: "Start Basic SEO",
        path: "/packages/seo-basic",
        highlight: false,
      },
      {
        name: "Advanced SEO",
        price: "₹35,000",
        per: "per month",
        tag: "Best Results",
        desc: "Aggressive full-spectrum SEO — 25+ keywords, blog content, link building, and weekly updates.",
        features: [
          { text: "25+ keywords tracked", yes: true },
          { text: "Full technical SEO", yes: true },
          { text: "4 SEO blog posts per month", yes: true },
          { text: "15+ backlinks per month", yes: true },
          { text: "Core Web Vitals pass", yes: true },
          { text: "Competitor gap analysis", yes: true },
          { text: "Weekly rank updates", yes: true },
          { text: "Dedicated SEO manager", yes: true },
        ],
        cta: "Start Advanced SEO",
        path: "/packages/seo-advanced",
        highlight: true,
      },
      {
        name: "Local SEO",
        price: "₹8,000",
        per: "per month",
        tag: null,
        desc: "Google Maps, local citations, and near-me search ranking for location-based businesses.",
        features: [
          { text: "Google Business Profile", yes: true },
          { text: "5 local keywords", yes: true },
          { text: "Local citations (10/mo)", yes: true },
          { text: "Review generation strategy", yes: true },
          { text: "Map pack ranking focus", yes: true },
          { text: "Monthly local report", yes: true },
          { text: "Blog content", yes: false },
          { text: "National keyword targeting", yes: false },
        ],
        cta: "Start Local SEO",
        path: "/contact",
        highlight: false,
      },
    ],
  },
  {
    category: "Social Media",
    color: "#e63b2a",
    plans: [
      {
        name: "Starter",
        price: "₹12,000",
        per: "per month",
        tag: null,
        desc: "2 platforms managed with branded posts, reels, and community replies every month.",
        features: [
          { text: "2 platforms (Insta + FB)", yes: true },
          { text: "12 branded posts/month", yes: true },
          { text: "2 reels per month", yes: true },
          { text: "Content calendar", yes: true },
          { text: "Community management", yes: true },
          { text: "Monthly analytics report", yes: true },
          { text: "Ad campaign management", yes: false },
          { text: "LinkedIn + YouTube Shorts", yes: false },
        ],
        cta: "Start Starter",
        path: "/packages/social-media",
        highlight: false,
      },
      {
        name: "Growth",
        price: "₹22,000",
        per: "per month",
        tag: "Most Popular",
        desc: "3 platforms with more content, reels, ad creative setup, and competitor analysis.",
        features: [
          { text: "3 platforms", yes: true },
          { text: "20 branded posts/month", yes: true },
          { text: "4 reels per month", yes: true },
          { text: "Ad creative setup (no spend)", yes: true },
          { text: "Story designs", yes: true },
          { text: "Competitor analysis", yes: true },
          { text: "Monthly strategy call", yes: true },
          { text: "Paid ad management", yes: false },
        ],
        cta: "Start Growth",
        path: "/packages/social-media",
        highlight: true,
      },
      {
        name: "Pro",
        price: "₹40,000",
        per: "per month",
        tag: null,
        desc: "All platforms, paid ad management, influencer coordination, and dedicated social manager.",
        features: [
          { text: "All platforms", yes: true },
          { text: "30 branded posts/month", yes: true },
          { text: "8 reels per month", yes: true },
          { text: "Paid ad management (₹10k+ spend)", yes: true },
          { text: "Influencer coordination", yes: true },
          { text: "Bi-weekly strategy calls", yes: true },
          { text: "Dedicated social manager", yes: true },
          { text: "YouTube Shorts included", yes: true },
        ],
        cta: "Start Pro",
        path: "/packages/social-media",
        highlight: false,
      },
    ],
  },
  {
    category: "Design",
    color: "#6b3fa0",
    plans: [
      {
        name: "Logo Design",
        price: "₹10,000",
        per: "one-time",
        tag: null,
        desc: "3 unique logo concepts, unlimited revisions, all file formats, and social media kit.",
        features: [
          { text: "3 logo concepts", yes: true },
          { text: "Unlimited revisions", yes: true },
          { text: "All formats (AI, SVG, PNG, PDF)", yes: true },
          { text: "Light + dark versions", yes: true },
          { text: "Favicon + app icon", yes: true },
          { text: "Brand colour guide", yes: true },
          { text: "Full brand style guide", yes: false },
          { text: "Stationery design", yes: false },
        ],
        cta: "Start Logo",
        path: "/packages/graphic-logo",
        highlight: false,
      },
      {
        name: "Brand Identity",
        price: "₹35,000",
        per: "one-time",
        tag: "Complete Brand",
        desc: "Logo + full brand style guide + colour palette + typography + stationery + social templates.",
        features: [
          { text: "5 logo concepts", yes: true },
          { text: "50+ page brand style guide", yes: true },
          { text: "Colour + typography system", yes: true },
          { text: "Business card + letterhead", yes: true },
          { text: "Envelope + email signature", yes: true },
          { text: "10 social media templates", yes: true },
          { text: "Brand voice guidelines", yes: true },
          { text: "All source files (AI, Figma)", yes: true },
        ],
        cta: "Start Branding",
        path: "/packages/graphic-branding",
        highlight: true,
      },
      {
        name: "Print Bundle",
        price: "₹18,000",
        per: "one-time",
        tag: null,
        desc: "Complete print collateral — business card, letterhead, brochure, standee, and flyer.",
        features: [
          { text: "Business card (front + back)", yes: true },
          { text: "A4 letterhead", yes: true },
          { text: "Tri-fold brochure", yes: true },
          { text: "Roll-up standee", yes: true },
          { text: "A5 flyer", yes: true },
          { text: "Print-ready PDFs (CMYK 300dpi)", yes: true },
          { text: "Unlimited revisions", yes: true },
          { text: "Source files included", yes: true },
        ],
        cta: "Start Print",
        path: "/packages/graphic-print",
        highlight: false,
      },
    ],
  },
];

router.get('/', async (req, res) => {
  try {
    const pricing = await Pricing.find({ isActive: true });
    if (pricing.length === 0) {
      await Pricing.insertMany(seedPricing);
      return res.json(seedPricing);
    }
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const pricing = await Pricing.findOne({ category: req.params.category, isActive: true });
    if (!pricing) return res.status(404).json({ message: 'Pricing not found' });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:category', async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate(
      { category: req.params.category },
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
    await Pricing.deleteMany({});
    await Pricing.insertMany(seedPricing);
    res.json({ message: 'Pricing seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
