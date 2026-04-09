const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: "Team" },
  image: { type: String },
  bio: { type: String },
  description: { type: String },
  quote: { type: String },
  skills: [{ type: String }],
  technologies: [{ type: String }],
  experience: { type: String },
  video: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  github: { type: String },
  email: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
