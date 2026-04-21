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
  },
  { timestamps: true },
);

module.exports = mongoose.model("CompanyInfo", companyInfoSchema);
