import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoginModal from '../common/AdminLoginModal';

  // Professional Practice: Keep static data outside the component 
  // to prevent re-creation on every render.
const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'SERVICES', href: '/services' },
  { name: 'BOOKINGS', href: '/bookings' },
  { name: 'REVIEWS', href: '/reviews' },
  { name: 'CALENDAR', href: '/calendar' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminClick = () => {
    // Prevent navigating; open the modal instead.
    setIsAdminModalOpen(true);
    // On mobile, close the mobile menu
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect for the glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-lg border-b border-white/5 py-3' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col">
          <span className="text-xl tracking-[0.3rem] font-serif font-bold text-white uppercase">
            Styled <span className="italic font-light text-luxury-gold">By Miah</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] tracking-[0.2em] text-gray-300 hover:text-luxury-gold transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <button onClick={handleAdminClick} className="border border-luxury-gold/40 px-5 py-2 text-[10px] tracking-[0.2em] text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all duration-300">
            ADMIN ONLY
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Contained within the parent <nav> */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-luxury-gold/20 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs tracking-[0.3em] text-gray-300 hover:text-luxury-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button className="w-full border border-luxury-gold/40 py-4 text-[10px] tracking-[0.2em] text-luxury-gold">
                ADMIN LOGIN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </nav>
  );
};

export default Navbar;