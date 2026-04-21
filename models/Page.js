const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: String,
    enum: ['service', 'product', 'landing', 'content', 'blank'],
    default: 'content'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' }
  },
  hero: {
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    backgroundImage: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  },
  sections: [{
    type: {
      type: String,
      enum: ['features', 'stats', 'testimonials', 'faq', 'gallery', 'content', 'cta', 'team', 'pricing', 'comparison']
    },
    title: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: { type: mongoose.Schema.Types.Mixed, default: {} }
  }],
  sidebar: {
    enabled: { type: Boolean, default: false },
    links: [{
      title: { type: String, default: '' },
      url: { type: String, default: '' }
    }]
  },
  content: {
    description: { type: String, default: '' },
    body: { type: String, default: '' }
  }
}, {
  timestamps: true
});

pageSchema.index({ slug: 1 });
pageSchema.index({ status: 1, template: 1 });

module.exports = mongoose.model('Page', pageSchema);
