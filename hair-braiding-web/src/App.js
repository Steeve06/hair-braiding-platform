import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Homepage';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="appContainer">
        {/* Navbar*/}
        <Navbar />
        
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Future routes like /services, /booking, /gallery will go here */}
          </Routes>
        </main>

        {/* The Footer  */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
