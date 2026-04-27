/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import { SERVICES } from '../utils/constants';

const Bookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      //point to django backend endpoint for booking creation
      const response = await axios.post('http://127.0.0.1:8000/api/bookings/', {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      });

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Booking request submitted successfully! We will contact you soon.' });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setStatus({ type: 'error', message: 'Failed to submit booking. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors duration-300 placeholder:text-white/20";
  const labelClasses = "block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium";

  return (
    <div className="bg-luxury-black min-h-screen pt-32 pb-20 px-6">

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">
          — Reserve Your Slot —
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide">
          Book Appointment
        </h1>
      </div>

      {/* Booking Form Container */}
      <div className="max-w-2xl mx-auto bg-white/5 p-8 md:p-12 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Status Message */}
          {status.message && (
            <div className={`p-4 text-[11px] tracking-widest text-center uppercase border ${
              status.type === 'success' ? 'border-luxury-gold text-luxury-gold' : 'border-red-500 text-red-500'
            }`}>
              {status.message}
            </div>
          )}
          
          {/* Full Name */}
          <div>
            <label htmlFor="full-name" className={labelClasses}>Full Name</label>
            <input 
              id="full-name" 
              type="text" 
              placeholder="Your full name"
              className={inputClasses}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="email" className={labelClasses}>Email Address</label>
              <input 
                id="email"
                type="email" 
                placeholder="you@email.com"
                className={inputClasses}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClasses}>Phone Number</label>
              <input 
                id="phone"
                type="tel" 
                placeholder="(000) 000-0000"
                className={inputClasses}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label htmlFor="service-select" className={labelClasses}>Service</label>
            <select
              id="service-select" 
              className={`${inputClasses} appearance-none cursor-pointer`}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              required
            >
              <option value="">Select a service...</option>
              {SERVICES.map(s => (
                <option key={s.id} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="date" className={labelClasses}>Preferred Date</label>
              <input 
                id="date"
                type="date" 
                className={inputClasses}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className={labelClasses}>Preferred Time</label>
              <select 
                id="time"
                className={`${inputClasses} appearance-none cursor-pointer`}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              >
                <option value="">Select a time...</option>
                <option value="09:00">09:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClasses}>Special Requests</label>
            <textarea 
              rows="4"
              placeholder="Hair length, desired extensions, link to reference photos, etc."
              className={inputClasses}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
                isLoading 
                ? 'bg-gray-600 text-black cursor-not-allowed' 
                : 'bg-luxury-gold text-black hover:bg-white'
              }`}
            >
              {isLoading ? 'Processing...' : 'Submit Booking Request'}
            </button>
            <p className="text-[10px] text-white/30 text-center mt-6 tracking-widest leading-relaxed">
              A $25 deposit may be required to secure your slot. We'll reach out within 24 hours to confirm.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bookings;