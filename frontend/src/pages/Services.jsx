import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../utils/constants';

const Services = () => {
  const navigate = useNavigate();
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
        {SERVICES.map((service, index) => (
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
                    {service.price}
                  </p>
                  <p className="text-[10px] text-white/30 tracking-widest mt-1">
                    EST. {service.duration}
                  </p>
                </div>
                <button 
                  className="text-[10px] tracking-[0.2em] text-white uppercase border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors"
                  onClick={() => navigate('/booking')}
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