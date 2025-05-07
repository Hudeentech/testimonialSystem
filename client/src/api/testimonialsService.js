// testimonialsService.js

const API_BASE_URL = 'http://localhost:3000/api/testimonials';

// Custom toast notification function
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

  setTimeout(() => {
    toast.remove();
  }, 5000);
};

// Fetch all testimonials
export async function fetchTestimonials() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    const data = await response.json();
    console.log('Raw response from server:', data);
    // Log each testimonial's image path
    data.forEach(testimonial => {
      console.log('Testimonial:', {
        id: testimonial._id,
        name: testimonial.name,
        image: testimonial.image
      });
    });
    return data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    showToast('Error fetching testimonials. Please try again.');
    throw error;
  }
}

// Create a new testimonial
export async function createTestimonial(testimonial) {
  try {
    const formData = new FormData();

    // Validate image file if present
    if (testimonial.image) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSizeBytes = 12 * 1024 * 1024; // 12MB

      if (!allowedTypes.includes(testimonial.image.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.');
      }

      if (testimonial.image.size > maxSizeBytes) {
        throw new Error('File size exceeds the 12MB limit.');
      }
    }

    // Append fields
    Object.entries(testimonial).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val);
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log('Server response:', errorData);
      throw new Error(errorData?.message || 'Failed to create testimonial');
    }

    const result = await response.json();
    showToast('Testimonial created successfully!', 'success');
    return result;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    showToast(error.message || 'Error creating testimonial. Please try again.');
    throw error;
  }
}

// Delete a testimonial by ID (admin endpoint)
export async function deleteTestimonial(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete testimonial');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    showToast('Error deleting testimonial. Please try again.');
    throw error;
  }
}

export default {
  fetchTestimonials,
  createTestimonial,
  deleteTestimonial,
};
