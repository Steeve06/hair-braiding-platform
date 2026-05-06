import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import CalendarPage from './pages/CalendarPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="bg-luxury-black min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path='/admin-dashboard' element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;