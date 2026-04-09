const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  color: { type: String, default: '#f05a28' },
  plans: [{
    name: { type: String, required: true },
    price: { type: String, required: true },
    per: { type: String, default: 'one-time' },
    tag: { type: String, default: null },
    desc: { type: String, default: '' },
    features: [{
      text: { type: String },
      yes: { type: Boolean, default: true }
    }],
    cta: { type: String, default: '' },
    path: { type: String, default: '' },
    highlight: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Pricing', pricingSchema);
