import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Using Link for SPA routing
import { Menu, X, Scissors } from 'lucide-react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Book Now', path: '/booking', primary: true },
  ];

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        
        {/* Brand Name */}
        <Link to="/" className={styles.logoArea}>
          <Scissors className={styles.logoAccent} />
          <span>Styled by <span className={styles.logoAccent}>Miah</span></span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.linksDesktop}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${styles.navLink} ${link.primary ? styles.primaryBtn : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={styles.navLink}
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;