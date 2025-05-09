import React, { useEffect, useState } from 'react';
import { fetchTestimonials, deleteTestimonial } from '../api/testimonialsService';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BACKEND_URL = "https://testimonial-system.vercel.app";

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [timePeriod, setTimePeriod] = useState('week'); // Default to weekly view
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const groupByDay = (testimonialData) => {
    const sortedData = [...testimonialData].sort((a, b) => {
      const dateA = new Date(a.createdAt || new Date());
      const dateB = new Date(b.createdAt || new Date());
      return dateA - dateB;
    });

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    const grouped = sortedData.reduce((acc, testimonial) => {
      const date = new Date(testimonial.createdAt || new Date());
      if (!isNaN(date.getTime()) && date >= thirtyDaysAgo) {
        const day = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        if (!acc[day]) {
          acc[day] = {
            total: 0,
            withImage: 0,
            withoutImage: 0
          };
        }
        acc[day].total += 1;
        acc[day].withImage += testimonial.image ? 1 : 0;
        acc[day].withoutImage += testimonial.image ? 0 : 1;
      }
      return acc;
    }, {});
    return grouped;
  };

  const groupByWeek = (testimonialData) => {
    const sortedData = [...testimonialData].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const grouped = sortedData.reduce((acc, testimonial) => {
      const date = new Date(testimonial.createdAt);
      if (!isNaN(date.getTime())) {
        const week = new Date(date);
        week.setDate(date.getDate() - date.getDay());
        const weekKey = week.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
        
        if (!acc[weekKey]) {
          acc[weekKey] = {
            total: 0,
            withImage: 0,
            withoutImage: 0
          };
        }
        acc[weekKey].total += 1;
        acc[weekKey].withImage += testimonial.image ? 1 : 0;
        acc[weekKey].withoutImage += testimonial.image ? 0 : 1;
      }
      return acc;
    }, {});
    return grouped;
  };

  const groupByMonth = (testimonialData) => {
    const sortedData = [...testimonialData].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const grouped = sortedData.reduce((acc, testimonial) => {
      const date = new Date(testimonial.createdAt);
      if (!isNaN(date.getTime())) {
        const monthYear = date.toLocaleString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
        if (!acc[monthYear]) {
          acc[monthYear] = {
            total: 0,
            withImage: 0,
            withoutImage: 0
          };
        }
        acc[monthYear].total += 1;
        acc[monthYear].withImage += testimonial.image ? 1 : 0;
        acc[monthYear].withoutImage += testimonial.image ? 0 : 1;
      }
      return acc;
    }, {});
    return grouped;
  };

  const prepareChartData = (testimonialData) => {
    let groupedData;
    switch (timePeriod) {
      case 'day':
        groupedData = groupByDay(testimonialData);
        break;
      case 'week':
        groupedData = groupByWeek(testimonialData);
        break;
      case 'month':
        groupedData = groupByMonth(testimonialData);
        break;
      default:
        groupedData = groupByWeek(testimonialData);
    }

    const labels = Object.keys(groupedData);
    const totalData = labels.map(label => groupedData[label].total);
    const withImageData = labels.map(label => groupedData[label].withImage);
    const withoutImageData = labels.map(label => groupedData[label].withoutImage);

    return {
      labels,
      datasets: [
        {
          label: 'Total Testimonials',
          data: totalData,
          backgroundColor: 'rgba(245, 158, 11, 0.6)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(245, 158, 11, 0.8)',
        },
        {
          label: 'With Image',
          data: withImageData,
          backgroundColor: 'rgba(52, 211, 153, 0.6)',
          borderColor: 'rgb(52, 211, 153)',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(52, 211, 153, 0.8)',
        },
        {
          label: 'Without Image',
          data: withoutImageData,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(239, 68, 68, 0.8)',
        }
      ]
    };
  };

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
        setChartData(prepareChartData(data));
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        showToast('Failed to fetch testimonials. Please try again.', 'error');
      }
    };

    getTestimonials();
  }, [timePeriod]); // Re-run when time period changes

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Testimonials Overview (${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}ly)`,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          stepSize: 1,
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9,
    animation: {
      duration: 500
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
        <div className='flex justify-between items-center mb-4'>
          <div>
            <p className='text-lg mb-2'>Manage your testimonials collection.</p>
            <p className='text-xl'>Total Testimonials: <span className='text-yellow-400 font-bold'>{totalTestimonials}</span></p>
            <p className='text-xl'>Average Rating: <span className='text-yellow-400 font-bold'>{averageRating}</span> / 5</p>
          </div>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className='bg-[#242424] text-white px-4 py-2 rounded-md border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500'
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        
        {/* Chart Container */}
        <div className='w-full h-[400px] mt-6 p-4 bg-[#242424] rounded-lg'>
          <Bar data={chartData} options={chartOptions} />
        </div>
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
                  console.log('Image failed to load:', e.target.src);
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
