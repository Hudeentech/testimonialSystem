import React, { useEffect, useState } from 'react';
import { fetchTestimonials, deleteTestimonial } from '../api/testimonialsService';

const BACKEND_URL = "https://testimonial-system.vercel.app" // Adjust this URL based on your backend setup;

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        console.log('Fetched testimonials:', data); // Debug log
        data.forEach(testimonial => {
          if (testimonial.image) {
            console.log('Image path:', `${BACKEND_URL}${testimonial.image}`); // Debug image URLs
          }
        });
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        showToast('Failed to fetch testimonials. Please try again.', 'error');
      }
    };

    getTestimonials();
  }, []);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 px-6 py-3 text-white rounded-md shadow-lg z-50 animate-fade-in-out transition-all duration-500 ease-in-out ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 5000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      const element = document.getElementById(`testimonial-${id}`);
      if (element) {
        element.classList.add('animate-fade-out');
        setTimeout(() => {
          setTestimonials((prev) => prev.filter((testimonial) => testimonial._id !== id));
        }, 500);
      } else {
        setTestimonials((prev) => prev.filter((testimonial) => testimonial._id !== id));
      }
      showToast('Testimonial deleted successfully.');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showToast('Failed to delete testimonial. Please try again.', 'error');
    }
  };

  const totalTestimonials = testimonials.length;
  const averageRating = (totalTestimonials / 2).toFixed(2);

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='flex bg-gradient-to-b from-amber-300 to-yellow-700 bg-clip-text items-center justify-between mb-6'>
        <h2 className='text-3xl lg:text-5xl font-bold text-transparent'>Dashboard</h2>
      </div>

      <div className='bg-[#1f1f1f] p-6 rounded-lg text-gray-200 mb-6 shadow-md'>
        <p className='text-lg mb-2'>Manage your testimonials collection.</p>
        <p className='text-xl'>Total Testimonials: <span className='text-yellow-400 font-bold'>{totalTestimonials}</span></p>
        <p className='text-xl'>Average Rating: <span className='text-yellow-400 font-bold'>{averageRating}</span> / 5</p>
      </div>

      <ul className='bg-[#222b] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-md p-4 min-h-[fit-content] gap-4'>
        {testimonials.map((testimonial) => (
          <li
            key={testimonial._id}
            id={`testimonial-${testimonial._id}`}
            className='mb-4 p-4 border min-w-[280px] border-[#353535] shadow-xl rounded-xl bg-[#242424] text-white transition-all duration-500'>
            <div className='flex items-center mb-2'>
              <img
                src={testimonial.image ? `${testimonial.image}` : '/user-regular.svg'}
                alt={testimonial.name}
                className='w-16 h-16 rounded-full mr-4 p-1 object-contain border-2 border-yellow-400 bg-gray-800'
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src); // Debug failed image loads
                  e.target.src = '/user-regular.svg';
                }}
              />
              <div>
                <h3 className='text-lg font-semibold text-yellow-400'>{testimonial.name}</h3>
                <p className='text-gray-400'>{testimonial.company}</p>
                <p className='text-gray-400'>{testimonial.jobTitle}</p>
              </div>
            </div>
            <p className='text-gray-300'>{testimonial.message}</p>
            <button
              onClick={() => handleDelete(testimonial._id)}
              className='bg-red-500 text-sm text-white px-4 py-2 mt-4 rounded-md hover:bg-red-600'>
              <i className='fas fa-trash mr-2'></i> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
