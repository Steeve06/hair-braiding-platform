/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Clock, X, Pencil, LayoutDashboard, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'https://styledbymiah-backend.onrender.com';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  }, [navigate]);

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('bookings');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    title: '', description: '', price: '', duration: '', image: null, order: 0
  });

  // --- TOKEN REFRESH HELPER ---
  const getValidToken = useCallback(async () => {
  const token = localStorage.getItem('adminToken');
  const refresh = localStorage.getItem('refreshToken');

  if (!refresh) {
    handleLogout();
    return null;
  }

  try {
    // Proactively refresh — don't test first, just get a fresh token
    const res = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
    const newToken = res.data.access;
    localStorage.setItem('adminToken', newToken);
    return newToken;
  } catch {
    // Refresh token expired — force logout
    handleLogout();
    return null;
  }
}, [API_URL, handleLogout]);

  // --- API LOGIC ---

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const endpoint = activeTab === 'bookings' ? 'bookings/' : 'services/';
      const res = await axios.get(`${API_URL}/api/${endpoint}`, config);
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ FIXED: Uses getValidToken() to handle expired tokens before patching
  const handleUpdateStatus = async (id, newStatus) => {
    const token = await getValidToken();
    if (!token) return;

    try {
      await axios.patch(
        `${API_URL}/api/bookings/${id}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(prevData => prevData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
      alert(`Booking ${newStatus} successfully.`);
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const token = await getValidToken();
    if (!token) return;

    try {
      const endpoint = type === 'booking' ? 'bookings' : 'services';
      await axios.delete(`${API_URL}/api/${endpoint}/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ FIXED: Removed hardcoded old backend URL
  const handleAddService = async (e) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) return;

    const formData = new FormData();
    Object.keys(newService).forEach(key => {
      if (newService[key] !== null) formData.append(key, newService[key]);
    });

    try {
      await axios.post(`${API_URL}/api/services/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowAddService(false);
      setNewService({ title: '', description: '', price: '', duration: '', image: null, order: 0 });
      fetchData();
    } catch (err) {
      console.error("Add Service Error:", err.response?.data);
      alert("Failed to add service. Please check your admin permissions.");
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) return;

    const formData = new FormData();
    Object.keys(editingService).forEach(key => {
      if (key === 'image' && typeof editingService[key] === 'string') return;
      if (editingService[key] !== null) formData.append(key, editingService[key]);
    });

    try {
      await axios.patch(`${API_URL}/api/services/${editingService.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setShowEditService(false);
      fetchData();
    } catch (err) {
      alert("Failed to update service");
    }
  };

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

        {/* Data Table */}
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
                              {item.status === 'pending' && (
                                <div className="flex gap-2 mr-4">
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'confirmed')} 
                                    className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-full transition-all"
                                    title="Accept Booking"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
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
                              <button aria-label="pencil" onClick={() => { setEditingService(item); setShowEditService(true); }} className="text-luxury-gold hover:text-white"><Pencil size={18} /></button>
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

        {/* MODAL: ADD SERVICE */}
        {showAddService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-luxury-black border border-white/10 p-10 w-full max-w-xl relative">
              <button onClick={() => setShowAddService(false)} className="absolute top-6 right-6 text-white/30 hover:text-white"><X /></button>
              <h2 className="text-2xl font-serif mb-8 text-center">New Service</h2>
              <form onSubmit={handleAddService} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <input placeholder="Title" required className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setNewService({...newService, title: e.target.value})} />
                </div>
                <input placeholder="Price" className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setNewService({...newService, price: e.target.value})} />
                <input placeholder="Duration (e.g. 2 hours)" className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setNewService({...newService, duration: e.target.value})} />
                <div className="col-span-2">
                  <input type="file" accept="image/*" className="text-xs" onChange={e => setNewService({...newService, image: e.target.files[0]})} />
                </div>
                <textarea placeholder="Description" rows="3" className="col-span-2 w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setNewService({...newService, description: e.target.value})} />
                <button type="submit" className="col-span-2 bg-luxury-gold text-black py-4 font-bold uppercase text-[10px]">Create Service</button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT SERVICE */}
        {showEditService && editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-luxury-black border border-white/10 p-10 w-full max-w-xl relative">
              <button onClick={() => setShowEditService(false)} className="absolute top-6 right-6 text-white/30 hover:text-white"><X /></button>
              <h2 className="text-2xl font-serif mb-8 text-center">Edit {editingService.title}</h2>
              <form onSubmit={handleUpdateService} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <input value={editingService?.title || ''} required className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setEditingService({...editingService, title: e.target.value})} />
                </div>
                <input value={editingService.price} className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setEditingService({...editingService, price: e.target.value})} />
                <input value={editingService.duration} className="w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setEditingService({...editingService, duration: e.target.value})} />
                <div className="col-span-2">
                  <p className="text-[9px] text-luxury-gold uppercase mb-2">New Image (Optional)</p>
                  <input type="file" accept="image/*" className="text-xs" onChange={e => setEditingService({...editingService, image: e.target.files[0]})} />
                </div>
                <textarea value={editingService.description} rows="3" className="col-span-2 w-full bg-white/5 border border-white/10 p-3 text-sm" onChange={e => setEditingService({...editingService, description: e.target.value})} />
                <button type="submit" className="col-span-2 bg-luxury-gold text-black py-4 font-bold uppercase text-[10px]">Save Changes</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;