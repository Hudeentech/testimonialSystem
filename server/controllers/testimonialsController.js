require('dotenv').config();
const Testimonial = require('../models/Testimonial');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
}).single('image');

exports.upload = upload;

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, message, jobTitle, company } = req.body;
      if (!name || !message || !jobTitle || !company) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      let imageUrl = null;
      if (req.file) {
        // For now, we'll just store the file name
        // In production, you'd want to store this in a cloud service
        imageUrl = `/uploads/${req.file.originalname}`;
      }

      const testimonial = new Testimonial({
        name,
        message,
        jobTitle,
        company,
        image: imageUrl
      });

      await testimonial.save();
      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  });
};



