import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* The background grid is already handled by your body selector in index.css, 
         so we don't need a separate div here unless you want a different size.
      */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-4xl"
      >
        {/* Top Label */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="h-px w-8 bg-luxury-gold/40" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-medium">
            Luxury Braiding Studio · Atlanta
          </span>
          <div className="h-px w-8 bg-luxury-gold/40" />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight mb-8">
          The Art of <br />
          <span className="italic text-luxury-gold font-light">Styled Braids</span>
        </h1>

        {/* Subtext */}
        <p className="max-w-xl mx-auto text-white/60 text-sm md:text-base leading-relaxed font-light mb-12 tracking-wide">
          Precision protective styling crafted with care — where heritage meets artistry, and every braid tells a story.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/bookings">
            <button className="bg-luxury-gold text-luxury-black px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300 w-full sm:w-auto">
              Book Appointment
            </button>
          </Link>
          <Link to="/services">
            <button  className="border border-white/20 text-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:border-luxury-gold transition-colors duration-300 w-full sm:w-auto">
              Explore Services
            </button>
          </Link>

        </div>
      </motion.div>

      {/* Decorative vertical line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-luxury-gold to-transparent opacity-50" />
    </section>
  );
};

export default Hero;