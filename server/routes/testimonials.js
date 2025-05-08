const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const adminController = require('../controllers/adminController');

// Public routes
router.get('/', testimonialsController.getAllTestimonials);
router.post('/', testimonialsController.upload, testimonialsController.createTestimonial);

// Admin routes
router.post('/admin/create', adminController.upload.single('image'), adminController.createTestimonial);
router.put('/admin/update/:id', adminController.upload.single('image'), adminController.updateTestimonial);
router.delete('/admin/delete/:id', adminController.deleteTestimonial);

module.exports = router;