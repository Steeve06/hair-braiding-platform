import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import Footer from '../components/layout/Footer'; 
import { STUDIO_CONFIG } from '../utils/constants'; 
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  it('renders the studio brand name from constants', () => {
    render(<Footer />);
    
    // Using getByRole to avoid the "multiple elements" error from earlier
    const brandName = screen.getByRole('heading', { 
      level: 3, 
      name: new RegExp(STUDIO_CONFIG.name, 'i') 
    });
    
    expect(brandName).toBeInTheDocument();
  });

  it('renders studio social links and excludes LinkedIn from the main row', () => {
    render(<Footer />);
    
    // Basic check for one social icon
    const instagramLink = screen.getByLabelText(/Instagram/i);
    expect(instagramLink).toBeInTheDocument();

    // Verify LinkedIn is NOT in the main social links (using queryBy instead of getBy)
    const mainSocialLinks = screen.queryAllByRole('link');
    const linkedInInMainRow = mainSocialLinks.find(
      link => link.getAttribute('aria-label') === 'LinkedIn'
    );
    
    expect(linkedInInMainRow).toBeUndefined();
  });

  it('renders the professional signature with the LinkedIn icon', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Crafted with excellence by/i)).toBeInTheDocument();

    // Matches the 'title="Developer LinkedIn"' in your Footer.jsx
    const linkedinIcon = screen.getByTitle(/Developer LinkedIn/i);
    expect(linkedinIcon).toBeInTheDocument();
  });
});