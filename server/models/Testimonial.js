const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);