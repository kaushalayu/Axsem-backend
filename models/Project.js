const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: String,
  category: String,
  tags: [String],
  color: String,
  year: String,
  duration: String,
  client: String,
  industry: String,
  status: { type: String, enum: ['Live', 'In Progress', 'Completed'], default: 'Live' },
  featured: { type: Boolean, default: false },
  links: {
    live: String,
    github: String
  },
  overview: String,
  description: String,
  challenge: String,
  solution: String,
  results: [{
    metric: String,
    label: String
  }],
  techStack: [{
    category: String,
    items: [String]
  }],
  gallery: [String],
  testimonial: {
    quote: String,
    author: String,
    role: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
