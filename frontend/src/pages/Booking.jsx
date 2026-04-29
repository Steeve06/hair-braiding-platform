/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import { SERVICES as STATIC_SERVICES } from '../utils/constants';
import { Turnstile } from '@marsidev/react-turnstile';

const Bookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const [availableServices, setAvailableServices] = useState(STATIC_SERVICES);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    notes: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://backend-styledbymiah.onrender.com';
        const response = await axios.get(`${API_URL}/api/services/`);
        if (response.data && response.data.length > 0) {
          setAvailableServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to static services is already handled by initial state
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ type: 'error', message: 'Please complete the security check.' });
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://backend-styledbymiah.onrender.com';
      await axios.post(`${API_URL}/api/bookings/`, {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        turnstile_token: token
      });
      setStatus({ type: 'success', message: 'Booking request submitted!' });
      setFormData({ fullName: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Submission failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors duration-300";
  const labelClasses = "block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium";

  return (
    <div className="bg-luxury-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto bg-white/5 p-8 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Turnstile and Status messages here... */}

          <div>
            <label htmlFor="fullName" className={labelClasses}>Full Name</label>
            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label htmlFor="service-select" className={labelClasses}>Service</label>
            <select
              id="service-select" 
              name="service" 
              value={formData.service}
              className={inputClasses}
              onChange={handleChange}
              required
            >
              <option value="">Select a service...</option>
              {availableServices.map(s => (
                <option key={s.id} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Date, Time, and Notes fields... */}

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-luxury-gold text-black uppercase tracking-widest font-bold">
            {isLoading ? 'Processing...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bookings;