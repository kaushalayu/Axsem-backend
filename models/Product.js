const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: String,
  description: String,
  icon: String,
  color: String,
  category: { type: String, enum: ['Industry', 'Business', 'Education', 'Other'], default: 'Business' },
  tag: String,
  path: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);