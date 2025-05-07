const Testimonial = require('../models/Testimonial');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, message, jobTitle, company } = req.body;
    
    // Validate required fields
    if (!name || !message || !jobTitle || !company) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name, message, jobTitle, company }
      });
    }

    let image = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      const extname = path.extname(file.name).toLowerCase();
      
      // Validate file type
      if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
        return res.status(400).json({ error: 'Invalid file type. Only jpg, jpeg and png image files are allowed.' });
      }

      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname}`;
      const uploadPath = path.join(__dirname, '../uploads/', fileName);
      
      await file.mv(uploadPath);
      // Save the complete URL for the image
      image = `http://localhost:3000/uploads/${fileName}`;
    }

    const newTestimonial = new Testimonial({
      name,
      message,
      jobTitle,
      company,
      image
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (err) {
    console.error('Error in createTestimonial:', err);
    res.status(500).json({ 
      error: 'Failed to create testimonial',
      details: err.message 
    });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, message, jobTitle, company } = req.body;
    const updatedData = { name, message, jobTitle, company };

    if (req.files && req.files.image) {
      const file = req.files.image;
      const extname = path.extname(file.name).toLowerCase();
      
      if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
        return res.status(400).json({ error: 'Invalid file type. Only jpg, jpeg and png image files are allowed.' });
      }

      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname}`;
      const uploadPath = path.join(__dirname, '../uploads/', fileName);
      
      await file.mv(uploadPath);
      // Save the complete URL for the image
      updatedData.image = `http://localhost:3000/uploads/${fileName}`;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { new: true }
    );
    res.status(200).json(updatedTestimonial);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};