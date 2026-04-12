const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String },
  phone: { type: String },
  email: { type: String },
  companyName: { type: String },
  city: { type: String },
  service: { type: String },
  serviceInterest: { type: String },
  budget: { type: String },
  message: { type: String, default: '' },
  subject: { type: String },
  source: { type: String, default: 'contact' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
