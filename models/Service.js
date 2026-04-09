const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  icon: { type: String, default: 'FiCode' },
  color: { type: String, default: '#f05a28' },
  tag: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: [{ type: String }],
  stat: { type: String, default: '0' },
  statLabel: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
