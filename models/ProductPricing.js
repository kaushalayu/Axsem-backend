const mongoose = require('mongoose');

const productPricingSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  route: { type: String, required: true },
  color: { type: String, default: '#f05a28' },
  tiers: [{
    name: { type: String, required: true },
    price: { type: String, required: true },
    per: { type: String, default: '' },
    desc: { type: String, default: '' },
    features: [{ type: String }],
    highlight: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ProductPricing', productPricingSchema);
