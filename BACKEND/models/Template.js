// models/Template.js
const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
  type: { type: String, enum: ['headline', 'subheadline', 'image', 'cta', 'logo'], required: true },
  placeholder: String,
  slot: String,
  fontSize: Number,
  fontFamily: String,
  color: String,
  position: { x: Number, y: Number },
  width: Number,
  height: Number
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // 'Sale', 'Launch', 'Festival' etc.
  thumbnail: String,
  dimensions: { width: Number, height: Number },
  elements: [elementSchema],
  colors: {
    primary: String,
    secondary: String,
    background: String
  },
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);