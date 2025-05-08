const Testimonial = require('../models/Testimonial');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

// Configure multer for memory storage instead of disk storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpeg, jpg, png)'));
  },
});

exports.upload = upload;

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, message, jobTitle, company } = req.body;
    if (!name || !message || !jobTitle || !company) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // For now, we'll store the image as a URL string
    // Later, implement cloud storage integration here
    const image = req.file ? req.file.originalname : null;
    
    const newTestimonial = new Testimonial({ 
      name, 
      message, 
      jobTitle, 
      company, 
      image 
    });
    
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Failed to create testimonial', details: err.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, message, jobTitle, company } = req.body;
    const image = req.file ? req.file.originalname : undefined;
    
    const updateData = { 
      name, 
      message, 
      jobTitle, 
      company,
      ...(image && { image })
    };

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json(updatedTestimonial);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

// Generate a one-time link
exports.generateOneTimeLink = (req, res) => {
  try {
    const payload = { id: req.body.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/testimonial/${token}`;
    res.status(200).json({ link });
  } catch (err) {
    console.error('Error generating link:', err);
    res.status(500).json({ error: 'Failed to generate link' });
  }
};

// Validate a one-time link
exports.validateOneTimeLink = (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, id: decoded.id });
  } catch (err) {
    console.error('Error validating link:', err);
    res.status(400).json({ valid: false, error: 'Invalid or expired link' });
  }
};