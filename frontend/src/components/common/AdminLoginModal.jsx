/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('admin'); // Default for demo
  const [password, setPassword] = useState('braid2023'); // Default for demo

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      if (response.data.access) {
        localStorage.setItem('adminToken', response.data.access);
        console.log('Login successful!');
        onClose();
        //redirect to dashboard
        window.location.href = '/admin-dashboard';
      }
    } catch (error) {
      alert('Login failed. Authorized Personnel Only. Please check your credentials and try again.');
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      {/* Modal Container */}
      <div className="relative bg-black/90 p-12 border border-white/5 shadow-2xl w-full max-w-md">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-white tracking-wide">
            Admin Login
          </h2>
          <p className="text-[10px] text-white/30 mt-2 tracking-widest uppercase leading-relaxed max-w-50 mx-auto">
            Restricted Access • Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/60 border border-white/10 px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors placeholder:text-white/20"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-[10px] tracking-[0.2em] text-luxury-gold uppercase mb-2 font-medium">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-white/10 px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors placeholder:text-white/20"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-luxury-gold text-black py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-colors duration-500"
            >
              Enter Dashboard
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;