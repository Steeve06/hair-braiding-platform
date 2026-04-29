/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import { SERVICES as STATIC_SERVICES} from '../utils/constants';
import {Turnstile} from '@marsidev/react-turnstile';

const Bookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [SERVICES, setSERVICES] = useState(STATIC_SERVICES);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://backend-styledbymiah.onrender.com';
        const response = await axios.get(`${API_URL}/api/services/`);
        // If the admin has added services, use them; otherwise, fallback to constants
        setSERVICES(response.data.length > 0 ? response.data : STATIC_SERVICES);
      } catch (error) {
        console.error("Error fetching services:", error);
        setSERVICES(STATIC_SERVICES); // Fallback on error
      }
    };
    fetchServices();
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    notes: ''
  });

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    // Use 'id' or 'name' depending on how you attribute your tags
    const field = id || name; 
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus({ type: 'error', message: 'Please complete the security check.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      //point to django backend endpoint for booking creation
      const API_URL = import.meta.env.VITE_API_URL || 'https://backend-styledbymiah.onrender.com';
      const response = await axios.post(`${API_URL}/api/bookings/`, {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        turnstile_token: token
      });

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Booking request submitted successfully! We will contact you soon.' });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          notes: ''
        });
        setToken(null);
      }
    } catch (error) {
      // This helps you see what the BACKEND is actually complaining about
      const serverError = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      console.error('Full Error Detail:', serverError);
      setStatus({ type: 'error', message: 'Submission failed. Please check your inputs.' });
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
         {import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
          <Turnstile 
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
            onSuccess={(t) => setToken(t)} 
            onError={() => setStatus({ type: 'error', message: 'Security check failed to load. Please refresh.' })}
            options={{
              theme: 'dark',
            }}
          />
        ) : (
          <p className="text-red-500 text-[10px]">Security configuration missing.</p>
        )}

          {/* Status Message */}
          {status.message && (
            <div className={`p-4 text-[11px] tracking-widest text-center uppercase border ${
              status.type === 'success' ? 'border-luxury-gold text-luxury-gold' : 'border-red-500 text-red-500'
            }`}>
              {status.message}
            </div>
          )}
          
          {/* Full Names */}
          <div>
            <label htmlFor="fullName" className={labelClasses}>Full Name</label>
            <input 
              id="fullName" 
              name="fullName"
              type="text" 
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClasses}
              required
            />
          </div>

          {/* Email & Phone Row */}
          <div>
            <label htmlFor="email" className={labelClasses}>Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className={inputClasses}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
            <input 
              id="phone"
              name="phone"
              type="tel" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="(000) 000-0000"
              className={inputClasses}
              required
            />
          </div>

          {/* Service Selection */}
          <div>
            <label htmlFor="service-select" className={labelClasses}>Service</label>
            <select
              id="service-select" 
              name="service"
              value={formData.service}
              className={`${inputClasses} appearance-none cursor-pointer`}
              onChange={handleChange}
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
                name="date"
                value={formData.date}
                className={inputClasses}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className={labelClasses}>Preferred Time</label>
              <select 
                id="time"
                name="time"
                value={formData.time}
                className={`${inputClasses} appearance-none cursor-pointer`}
                onChange={handleChange}
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
            <label htmlFor="notes" className={labelClasses}>Special Requests</label>
            <textarea 
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes}
              placeholder="Hair length, desired extensions, link to reference photos, etc."
              className={inputClasses}
              onChange={handleChange}
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