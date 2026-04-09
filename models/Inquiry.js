const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  service: { type: String, required: true },
  message: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
