const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  era: { type: String, required: true },
  headline: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String },
  photoLabel: { type: String },
  stat: {
    val: { type: String },
    lbl: { type: String }
  },
  tags: [{ type: String }],
  color: { type: String, default: "#f05a28" },
  side: { type: String, enum: ['left', 'right'], default: 'right' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Journey', journeySchema);
