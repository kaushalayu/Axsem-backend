const mongoose = require('mongoose');

const navbarLinkSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Services', 'Products', 'Company', 'Quick Links', 'Packages', 'Resources'],
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
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NavbarLink',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  openInNewTab: {
    type: Boolean,
    default: false
  },
  megaMenuData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  isPackage: {
    type: Boolean,
    default: false
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

navbarLinkSchema.index({ category: 1, order: 1 });
navbarLinkSchema.index({ parentId: 1 });

module.exports = mongoose.model('NavbarLink', navbarLinkSchema);
