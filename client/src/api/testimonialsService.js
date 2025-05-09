// testimonialsService.js

const API_BASE_URL = 'https://testimonial-system.vercel.app/api/testimonials';

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
    
    // Validate and format dates
    const validatedData = data.map(testimonial => {
      // Ensure createdAt is a valid date string
      if (!testimonial.createdAt) {
        console.warn('Missing createdAt for testimonial:', testimonial._id);
        testimonial.createdAt = new Date().toISOString(); // Use current date as fallback
      }
      
      // Log date parsing attempt
      console.log('Processing date:', {
        id: testimonial._id,
        rawDate: testimonial.createdAt,
        parsedDate: new Date(testimonial.createdAt)
      });
      
      return testimonial;
    });

    return validatedData;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    showToast('Error fetching testimonials. Please try again.');
    throw error;
  }
}

export async function createTestimonial(testimonial) {
  try {
    const formData = new FormData();

    if (testimonial.image instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSizeBytes = 12 * 1024 * 1024;

      if (!allowedTypes.includes(testimonial.image.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.');
      }

      if (testimonial.image.size > maxSizeBytes) {
        throw new Error('File size exceeds the 12MB limit.');
      }

      formData.append('image', testimonial.image);
    }

    // Append other fields
    formData.append('name', testimonial.name);
    formData.append('message', testimonial.message);
    formData.append('jobTitle', testimonial.jobTitle);
    formData.append('company', testimonial.company);

    const response = await fetch(`${API_BASE_URL}/admin/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to create testimonial');
    }

    const result = await response.json();
    showToast('Testimonial created successfully!', 'success');
    return result;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    showToast(error.message || 'Error creating testimonial.');
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
