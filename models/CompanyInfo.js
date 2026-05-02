const mongoose = require("mongoose");

const companyInfoSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Axsem Softwares" },
    tagline: { type: String, default: "Building digital products that scale" },
    email: { type: String, default: "info@Axsemsoftwares.com" },
    phone: { type: String, default: "+91 7860291285" },
    address: { type: String, default: "New Delhi, India" },
    logo: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    youtube: { type: String, default: "" },
    workingHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM" },
    foundedYear: { type: String, default: "2020" },
    seoTitle: {
      type: String,
      default: "Axsem - Best Software Development Company",
    },
    seoDescription: {
      type: String,
      default:
        "Axsem provides expert web development, mobile apps, and enterprise software solutions.",
    },
    
    // About Section Dynamic Fields
    aboutStory: {
      heading: { type: String, default: "Built on Passion, Driven by Purpose" },
      description1: { type: String, default: "Axsem Softwares was born from a simple belief — that small and mid-sized businesses deserve the same quality of software as Fortune 500 companies. We started in 2020 with a team of three, a handful of ideas, and an unwavering commitment to excellence." },
      description2: { type: String, default: "Today, we're a full-stack digital agency delivering web applications, mobile solutions, ERP systems, and cloud infrastructure to clients across industries. Our work doesn't end at deployment — we build lasting partnerships and evolve your product as your business grows." },
      image: { type: String, default: "" },
      stats: {
        years: { type: String, default: "5+" },
        clients: { type: String, default: "50+" },
        satisfaction: { type: String, default: "99%" },
        projects: { type: String, default: "100+" }
      }
    },
    aboutMission: {
      title: { type: String, default: "Empower Businesses Through Technology" },
      description: { type: String, default: "To deliver innovative, reliable, and scalable software solutions that help businesses of all sizes compete in the digital world — reducing complexity and increasing efficiency at every step." }
    },
    aboutVision: {
      title: { type: String, default: "India's Most Trusted Software Partner" },
      description: { type: String, default: "To be the go-to technology partner for growing businesses — known for our integrity, craftsmanship, and ability to turn ambitious ideas into products that create real-world impact." }
    },
    aboutValues: [{
      icon: { type: String, default: "zap" },
      title: { type: String, default: "Innovation First" },
      description: { type: String, default: "We push boundaries with cutting-edge tech to deliver solutions that keep you ahead of the curve." },
      color: { type: String, default: "#f05a28" }
    }],
    
    // SEO Fields
    seo: {
      title: { type: String, default: "Axsem - Best Software Development Company" },
      description: { type: String, default: "Axsem provides expert web development, mobile apps, and enterprise software solutions." },
      keywords: { type: String, default: "" }
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("CompanyInfo", companyInfoSchema);
