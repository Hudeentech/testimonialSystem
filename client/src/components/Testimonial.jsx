import React, { useState } from 'react';
import { createTestimonial } from '../api/testimonialsService';

const MAX_FILE_SIZE_MB = 12;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const showToast = (message, type = 'error') => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.color = '#fff';
  toast.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
};

export default function Testimonial() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    message: '',
    image: null
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]; // Safe access
    if (!file) {
        console.warn('No file selected.');
        return;
    }

    console.log("Selected image:", file);
    setFormData((prevFormData) => ({
        ...prevFormData,
        image: file
    }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      console.error("No image found in state");
  } else {
      console.log("Appending image to form data:", formData.image);
  }
  

    try {
      await createTestimonial(formData);
      setShowModal(true);
      setFormData({ name: '', company: '', jobTitle: '', message: '', image: null });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      showToast('Failed to submit testimonial. Please try again.');
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000008b] z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h1 className='text-4xl lg:text-6xl text-center m-auto  w-fit'>🎉🥰🎉</h1>
            <h2 className="text-xl font-semibold mb-4">Your review was submitted successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for your time and feedback.</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-yellow-400 text-gray-900 font-semibold rounded-full py-2 px-4 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className='bg-gradient-to-b from-amber-300 to-yellow-700 bg-clip-text'>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-transparent mb-2">
                  Loved Your Experience? <br /> Share the Love!
                </h2>
                <p className="text-gray-400 mb-4">
                  Your testimonial can help others just like you benefit from [Your Business/Product/Service].
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[#222d] text-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Please enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="company" className="block text-gray-300 text-sm mb-2">Company Name</label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-[#222d] text-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="jobTitle" className="block text-gray-300 text-sm mb-2">Your work title / position</label>
                <input
                  type="text"
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="bg-[#222d] text-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. senior web developer"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-300 text-sm mb-2">Testimonials</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="bg-[#222d] text-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Your Message / Testimonials here!"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label htmlFor="image" className="block text-gray-300 text-sm mb-2">Upload Image (Optional)</label>
                <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="..."
                accept="image/*"
              />

              </div>

              <button
                type="submit"
                className="bg-yellow-400 text-gray-900 font-semibold rounded-full py-3 px-6 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Submit <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </form>

            <div className="mt-4 text-gray-400 text-sm text-left">
              <i>
                Please note that this link will expire in 24hrs, and your testimonial will be displayed on the front page of my portfolio website.
                Visiting this link means you agree to the terms and conditions of my website, and also you are giving me the right to use your testimonial for marketing purposes.
                <br /><br />
                <span className="text-yellow-400 mt-4">Thank you for your time and support!</span>
              </i>
            </div>
          </div>

          <div className="hidden sticky top-8 h-[90dvh] p-4 lg:p-6 bg-[#222b] rounded-lg md:flex flex-col justify-center items-start">
            <div className="flex justify-center items-center">
              <img src="./Group 72.png" alt="testimonial-illustration" className="w-full object-contain p-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
