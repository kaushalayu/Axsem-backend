const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Web Development' },
  client: { type: String },
  year: { type: String },
  duration: { type: String },
  industry: { type: String },
  status: { type: String, default: 'Live' },
  featured: { type: Boolean, default: false },
  
  // Images
  thumbnail: { type: String },
  gallery: [{ type: String }],
  
  // Content
  overview: { type: String },
  challenge: { type: String },
  solution: { type: String },
  results: [{
    metric: { type: String },
    label: { type: String }
  }],
  
  // Tech stack used
  techStack: [{ type: String }],
  
  // Link
  liveUrl: { type: String },
  
  // Order for display
  order: { type: Number, default: 0 },
  
  // Status
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);