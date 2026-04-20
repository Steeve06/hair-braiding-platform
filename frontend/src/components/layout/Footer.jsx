import _React from 'react';
import { SOCIAL_LINKS, STUDIO_CONFIG } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Separate the studio socials from the developer signature
  const studioSocials = SOCIAL_LINKS.filter(link => link.name !== "LinkedIn");
  const linkedin = SOCIAL_LINKS.find(link => link.name === "LinkedIn");

  return (
    <footer className="bg-luxury-black border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Brand Name */}
        <h3 className="text-2xl font-serif text-luxury-gold tracking-[0.2em] mb-6">
          {STUDIO_CONFIG.name}
        </h3>

        {/* Main Socials (Instagram, Facebook, TikTok) */}
        <div className="flex space-x-8 mb-8">
          {studioSocials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="text-white/40 hover:text-luxury-gold transition-colors duration-300"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d={social.svgPath} />
              </svg>
            </a>
          ))}
        </div>

        {/* Copyright & Icon Signature */}
        <div className="text-center space-y-4">
          <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
            © {currentYear} {STUDIO_CONFIG.name} · {STUDIO_CONFIG.location}
          </p>
          
          <div className="flex items-center justify-center space-x-3 text-[9px] tracking-widest text-white/20 uppercase">
            <span>Crafted with excellence by</span>
            {linkedin && (
              <a 
                href={linkedin.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-luxury-gold/50 hover:text-luxury-gold transition-all duration-300 transform hover:scale-110"
                title="Developer LinkedIn"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d={linkedin.svgPath} />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;