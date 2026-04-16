const mongoose = require('mongoose');

const footerLinkSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Company', 'Services', 'Products', 'Support', 'Legal', 'Social', 'Contact'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  openInNewTab: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

footerLinkSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('FooterLink', footerLinkSchema);
