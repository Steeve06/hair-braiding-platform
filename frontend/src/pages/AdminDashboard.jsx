/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Clock, X, Pencil, LayoutDashboard, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken')
    navigate('/');
  };

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('bookings'); // Toggle between 'bookings' and 'services' view
  const [data, setData] = useState([]); // Holds current list of records from backend
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal Visibility States
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  
  // Form Data States
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    title: '', description: '', price: '', duration: '', image: null, order: 0
  });

  // --- API LOGIC ---

  /**
   * 1. FETCH DATA
   * Retrieves bookings or services based on the active tab.
   * Requires JWT token for authorization.
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const endpoint = activeTab === 'bookings' ? 'bookings/' : 'services/';
      const res = await axios.get(`http://127.0.0.1:8000/api/${endpoint}`, config);
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 2. UPDATE BOOKING STATUS
   * Sends a PATCH request to update 'pending' bookings to 'confirmed' or 'rejected'.
   */
  const handleUpdateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/bookings/${id}/status/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update UI locally to reflect the change immediately
      setData(prevData => prevData.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
      
      alert(`Booking ${newStatus} successfully.`);
    } catch (err) { 
      console.error("Status update failed", err);
      alert("Failed to update status.");
    }
  };

  /**
   * 3. DELETE RECORD
   * Removes a booking or service permanently from the database.
   */
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const token = localStorage.getItem('adminToken');
    try {
      const endpoint = type === 'booking' ? 'bookings' : 'services';
      await axios.delete(`http://127.0.0.1:8000/api/${endpoint}/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list after deletion
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- RENDERING HELPERS ---

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20 px-6 lg:px-16 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif tracking-wide mb-2">Management Console</h1>
            <p className="text-luxury-gold text-[10px] tracking-[0.3em] uppercase">Control Center • {activeTab}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-white/10 text-white/50 px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white hover:border-white transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
          
          {activeTab === 'services' && (
            <button 
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-2 bg-luxury-gold text-black px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all"
            >
              <Plus size={14} /> Add New Service
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-12 border-b border-white/5 mb-8">
          {['bookings', 'services'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] tracking-[0.3em] uppercase transition-all relative ${
                activeTab === tab ? 'text-luxury-gold' : 'text-white/30 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-luxury-gold" />}
            </button>
          ))}
        </div>

        {/* Dynamic Data Table */}
        <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-20 text-center text-luxury-gold animate-pulse tracking-widest uppercase text-xs">Loading Secure Data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/10 text-luxury-gold text-[9px] tracking-[0.2em] uppercase border-b border-white/5">
                  <tr>
                    {activeTab === 'bookings' ? (
                      <><th className="p-6">Client</th><th className="p-6">Schedule</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Actions</th></>
                    ) : (
                      <><th className="p-6">Service</th><th className="p-6">Price/Duration</th><th className="p-6">Order</th><th className="p-6 text-right">Actions</th></>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      {activeTab === 'bookings' ? (
                        <>
                          <td className="p-6">
                            <div className="text-sm font-medium">{item.full_name}</div>
                            <div className="text-[10px] text-white/40 uppercase">{item.email}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm">{item.service}</div>
                            <div className="text-[10px] text-white/40 uppercase">{item.date} @ {item.time}</div>
                          </td>
                          <td className="p-6 text-center">
                            <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full ${
                                item.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                item.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20'
                              }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-3 items-center">
                              {/* --- MISSING BUTTONS INTEGRATED HERE --- */}
                              {item.status === 'pending' && (
                                <div className="flex gap-2 mr-4">
                                  {/* Accept Button */}
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'confirmed')} 
                                    className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-full transition-all"
                                    title="Accept Booking"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  {/* Reject Button */}
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'rejected')} 
                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all"
                                    title="Reject Booking"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                              <button 
                                onClick={() => handleDelete(item.id, 'booking')} 
                                className="text-white/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // Services Row (Already exists in your file)
                        <>
                          <td className="p-6 flex items-center gap-4">
                            <img src={item.image} alt="" className="w-12 h-12 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                            <div>
                              <div className="text-sm">{item.title}</div>
                              <div className="text-[10px] text-white/40 line-clamp-1">{item.description}</div>
                            </div>
                          </td>
                          <td className="p-6 text-sm">
                            <div className="text-luxury-gold">${item.price}</div>
                            <div className="text-[10px] text-white/40 uppercase">{item.duration}</div>
                          </td>
                          <td className="p-6 text-xs text-white/30">Pos: {item.order}</td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingService(item); setShowEditService(true); }} className="text-luxury-gold hover:text-white"><Pencil size={18} /></button>
                              <button onClick={() => handleDelete(item.id, 'service')} className="text-white/20 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Modals for Add/Edit Service go here (Keep your existing modal code) */}
        
      </div>
    </div>
  );
};

export default AdminDashboard;