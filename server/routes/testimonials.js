const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const adminController = require('../controllers/adminController');

// Public routes
router.get('/', testimonialsController.getAllTestimonials);
router.post('/', testimonialsController.createTestimonial);

// Admin routes
router.post('/admin/create', adminController.createTestimonial);
router.put('/admin/update/:id', adminController.updateTestimonial);
router.delete('/admin/delete/:id', adminController.deleteTestimonial);

module.exports = router;