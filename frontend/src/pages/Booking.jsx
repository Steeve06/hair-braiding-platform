/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import { SERVICES as STATIC_SERVICES } from '../utils/constants';
import { Turnstile } from '@marsidev/react-turnstile';

const Bookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // 1. Use a unique name for state to avoid confusion with the import
  const [availableServices, setAvailableServices] = useState(STATIC_SERVICES);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    notes: ''
  });

  // 2. Fetch services and handle potential empty responses
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://backend-styledbymiah.onrender.com';
        const response = await axios.get(`${API_URL}/api/services/`);
        
        if (response.data && response.data.length > 0) {
          setAvailableServices(response.data);
        } else {
          setAvailableServices(STATIC_SERVICES);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setAvailableServices(STATIC_SERVICES);
      }
    };
    fetchServices();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [token, setToken] = useState(null);

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    const field = id || name; 
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ type: 'error', message: 'Please complete the security check.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
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
        setStatus({ type: 'success', message: 'Booking request submitted successfully!' });
        setFormData({
          fullName: '', email: '', phone: '', service: '', date: '', time: '', notes: ''
        });
        setToken(null);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Submission failed. Please check your inputs.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors duration-300 placeholder:text-white/20";
  const labelClasses = "block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium";

  return (
    <div className="bg-luxury-black min-h-screen pt-32 pb-20 px-6">
      <div className="text-center mb-16">
        <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">— Reserve Your Slot —</span>
        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide">Book Appointment</h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white/5 p-8 md:p-12 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          {import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
            <Turnstile 
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
              onSuccess={(t) => setToken(t)} 
              options={{ theme: 'dark' }}
            />
          ) : (
            <p className="text-red-500 text-[10px]">Security configuration missing.</p>
          )}

          {status.message && (
            <div className={`p-4 text-[11px] tracking-widest text-center uppercase border ${
              status.type === 'success' ? 'border-luxury-gold text-luxury-gold' : 'border-red-500 text-red-500'
            }`}>
              {status.message}
            </div>
          )}
          
          <div>
            <label htmlFor="fullName" className={labelClasses}>Full Name</label>
            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="email" className={labelClasses}>Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="phone" className={labelClasses}>Phone Number</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClasses} required />
            </div>
          </div>

          <div>
            <label htmlFor="service-select" className={labelClasses}>Service</label>
            <select
              id="service-select" 
              name="service" // 3. Ensure 'name' matches the formData key
              value={formData.service}
              className={`${inputClasses} appearance-none cursor-pointer`}
              onChange={handleChange}
              required
            >
              <option value="">Select a service...</option>
              {availableServices.map(s => (
                <option key={s.id} value={s.title} className="bg-zinc-900 text-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="date" className={labelClasses}>Preferred Date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="time" className={labelClasses}>Preferred Time</label>
              <select id="time" name="time" value={formData.time} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`} required>
                <option value="">Select a time...</option>
                <option value="09:00" className="bg-zinc-900">09:00 AM</option>
                <option value="12:00" className="bg-zinc-900">12:00 PM</option>
                <option value="15:00" className="bg-zinc-900">03:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClasses}>Special Requests</label>
            <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} className={inputClasses} />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
                isLoading ? 'bg-gray-600 text-black cursor-not-allowed' : 'bg-luxury-gold text-black hover:bg-white'
              }`}
            >
              {isLoading ? 'Processing...' : 'Submit Booking Request'}
            </button>
            <p className="text-[10px] text-white/30 text-center mt-6 tracking-widest leading-relaxed">
              A $25 deposit may be required to secure your slot.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bookings;