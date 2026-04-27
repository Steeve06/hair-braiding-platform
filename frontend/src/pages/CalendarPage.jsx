/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';
import { Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(async (selectedDate) => {
    setLoading(true);
    try {
      // Ensure date is formatted as YYYY-MM-DD local time
      const offset = selectedDate.getTimezoneOffset();
      const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formattedDate = localDate.toISOString().split('T')[0];
      
      const response = await axios.get(`http://127.0.0.1:8000/api/available-slots/?date=${formattedDate}`);
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSlots(date);
    }, 0);
    return () => clearTimeout(timer);
  }, [date, fetchSlots]);

  const handleSlotSelect = (slot) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    const formattedDate = localDate.toISOString().split('T')[0];
    
    // Navigate to booking page with details
    navigate(`/bookings?date=${formattedDate}&time=${slot}`);
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">Step 01</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white">Select Your Date</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left: Calendar Styling */}
          <div className="lg:col-span-2 bg-white/5 p-6 border border-white/10 rounded-sm">
            <style>{`
              .react-calendar { 
                background: transparent; 
                border: none; 
                font-family: inherit; 
                width: 100%;
              }
              .react-calendar__tile { color: white; padding: 1.5em 0.5em; }
              .react-calendar__tile:enabled:hover { background-color: rgba(212, 175, 55, 0.1); }
              .react-calendar__tile--active { background: #D4AF37 !important; color: black !important; }
              .react-calendar__navigation button { color: #D4AF37; font-size: 1.2rem; }
              .react-calendar__month-view__weekdays__weekday { color: rgba(255,255,255,0.3); font-size: 0.7rem; text-transform: uppercase; }
            `}</style>
            <Calendar 
              onChange={setDate} 
              value={date} 
              minDate={new Date()} 
            />
          </div>

          {/* Right: Slots Selection */}
          <div className="bg-white/5 p-8 border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-luxury-gold text-[11px] tracking-[0.2em] uppercase mb-6 flex items-center">
                <Clock className="mr-3" size={14} /> 
                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse" />)}
                </div>
              ) : (
                <div className="grid gap-3">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button 
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className="group flex justify-between items-center p-4 border border-white/10 text-white hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all duration-300"
                      >
                        <span className="text-sm tracking-widest">{slot}</span>
                        <ChevronRight size={14} className="text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center border border-dashed border-white/10">
                      <p className="text-white/30 text-xs uppercase tracking-widest">Fully Booked</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;