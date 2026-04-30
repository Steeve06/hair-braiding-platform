// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://styledbymiah-backend.onrender.com';
      const response = await axios.get(`${API_URL}/api/services/`);
      setServices(response.data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
    fetchServices();
  }, []);

  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-white text-center pt-40">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center pt-40 tracking-widest uppercase text-xs">Failed to load services. Please try again later.</div>;
  }

  return (
    <div className="bg-luxury-black min-h-screen pt-32 pb-20 px-6">
      {/* Header Section */}
      <div className="text-center mb-24">
        <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">
          — Service Menu —
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide">
          Our Offerings
        </h1>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto space-y-32">
        {services.map((service, index) => (
          <div 
            key={service.id}
            className={`flex flex-col md:items-center gap-12 md:gap-24 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 overflow-hidden bg-white/5 aspect-4/5">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-80 hover:opacity-100"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 space-y-6">
              <span className="text-4xl font-serif text-luxury-gold/20 block">
                {service.id}
              </span>
              <h2 className="text-4xl font-serif text-white tracking-tight">
                {service.title}
              </h2>
              <p className="text-white/50 leading-relaxed text-lg max-w-md font-light">
                {service.description}
              </p>
              
              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-3xl font-serif text-luxury-gold">
                    ${parseFloat(service.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-white/30 tracking-widest mt-1">
                    EST. {service.duration}
                  </p>
                </div>
                <button 
                  className="text-[10px] tracking-[0.2em] text-white uppercase border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors"
                  onClick={() => navigate(`/bookings?service=${encodeURIComponent(service.title)}`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;