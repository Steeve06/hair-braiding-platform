import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Homepage';
import ServicesPage from './pages/ServicesPage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="appContainer">
      {/* Only show glow on Home Page if desired, or keep it 
          and let ServicesPage cover it with its own background */}
      {isHomePage && (
        <div className="bg-glow-container">
          <div className="glow-top-left"></div>
          <div className="glow-bottom-right"></div>
        </div>
      )}

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
