/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import { SERVICES as STATIC_SERVICES } from '../utils/constants';
import { Turnstile } from '@marsidev/react-turnstile';

const Bookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [SERVICES, setSERVICES] = useState(STATIC_SERVICES);
  
  const [formData, setFormData] = useState({
    fullName: params.get('name') || '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://styledbymiah-backend.onrender.com';
        const response = await axios.get(`${API_URL}/api/services/`);
        if (response.data && response.data.length > 0) setSERVICES(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    const field = name || id;
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

    // Ensure date is strictly YYYY-MM-DD in local time (not UTC, which can shift the day)
    const rawDate = new Date(formData.date);
    const offset = rawDate.getTimezoneOffset();
    const localDate = new Date(rawDate.getTime() + offset * 60 * 1000);
    const formattedDate = localDate.toISOString().split('T')[0];

    // Ensure time is HH:MM
    const formattedTime = formData.time.split(' ')[0]; // Removes ' AM/PM' if present

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      date: formattedDate,
      time: formattedTime,
      notes: formData.notes,
      turnstile_token: token
    };

    const response = await axios.post(`${API_URL}/api/bookings/`, payload);

    if (response.status === 201) {
      setStatus({ type: 'success', message: 'Booking request submitted successfully!' });
      setFormData({ fullName: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
      setToken(null);
    }
  } catch (error) {
    // This will now catch the 400 errors from the serializer and show them in console
    console.error("Submission Error Details:", error.response?.data);
    setStatus({ 
      type: 'error', 
      message: error.response?.data?.error || 'Submission failed. Please check the form.' 
    });
  } finally {
    setIsLoading(false);
  }
};

  const inputClasses = "w-full bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-luxury-gold transition-all";
  const labelClasses = "block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium";

  return (
    <div className="bg-luxury-black min-h-screen pt-32 pb-20 px-6">
      {/* Header Section for Test Presence */}
      <div className="text-center mb-16">
        <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">
          — Reserve Your Slot —
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide">
          Book Appointment
        </h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white/5 p-8 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-6">
            {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
                onSuccess={(t) => setToken(t)} 
                options={{ theme: 'dark' }} 
              />
            )}
          </div>

          {status.message && (
            <div className={`p-4 border text-xs tracking-widest uppercase text-center ${status.type === 'success' ? 'border-luxury-gold text-luxury-gold' : 'border-red-500 text-red-500'}`}>
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
            <label htmlFor="service" className={labelClasses}>Service</label>
            <select id="service" name="service" value={formData.service} className={inputClasses} onChange={handleChange} required>
              <option value="">Select a service...</option>
              {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="date" className={labelClasses}>Preferred Date</label>
              <input id="date" name="date" type="date" value={formData.date} className={inputClasses} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="time" className={labelClasses}>Preferred Time</label>
              <select id="time" name="time" value={formData.time} className={inputClasses} onChange={handleChange} required>
                <option value="">Select a time...</option>
                <option value="09:00">09:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClasses}>Special Requests</label>
            <textarea id="notes" name="notes" rows="4" value={formData.notes} className={inputClasses} onChange={handleChange} placeholder="Any specific details..." />
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-luxury-gold text-black uppercase font-bold tracking-widest hover:bg-white transition-colors">
            {isLoading ? 'Processing...' : 'Submit Booking Request'}
          </button>
          
          {/* Policy Disclaimer */}
          <p className="text-[10px] text-white/30 text-center mt-6 tracking-widest">
            A $25 deposit may be required to secure your slot. We'll reach out within 24 hours to confirm.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Bookings;