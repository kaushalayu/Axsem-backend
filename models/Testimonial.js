const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  company: String,
  avatar: String,
  color: String,
  rating: { type: Number, default: 5 },
  review: String,
  type: { type: String, enum: ['text', 'video'], default: 'text' },
  videoUrl: String,
  thumbnail: String,
  project: String,
  location: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);