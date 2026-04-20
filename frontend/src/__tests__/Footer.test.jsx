import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import _Footer from '../components/layout/Footer';
import { STUDIO_CONFIG } from '../utils/constants'; // Import the source of truth
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  it('renders the studio brand name from constants', () => {
    render(<Footer />);
    
    // Verify the brand name from constants
    const brandName = screen.getByRole('heading', { 
      level: 3, 
      name: new RegExp(STUDIO_CONFIG.name, 'i') 
    });
    expect(brandName).toBeInTheDocument();
    // Verify it has the correct luxury styling class
    expect(brandName).toHaveClass('text-luxury-gold');
  });

  it('renders studio social links and excludes LinkedIn from the main row', () => {
    render(<Footer />);
    
    // We check for Instagram specifically as a smoke test for the loop
    const instagramLink = screen.getByLabelText(/Instagram/i);
    expect(instagramLink).toBeInTheDocument();

    // Verify that LinkedIn is NOT in the main social links row
    // The main socials use aria-labels; the signature uses a title
    const mainSocialLinks = screen.queryAllByRole('link');
    const linkedInInMainRow = mainSocialLinks.find(
      link => link.getAttribute('aria-label') === 'LinkedIn'
    );
    
    expect(linkedInInMainRow).toBeUndefined();
  });

  it('renders the professional signature with the LinkedIn icon', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Crafted with excellence by/i)).toBeInTheDocument();

    // This matches the 'title="Developer LinkedIn"' in your Footer.jsx
    const linkedinIcon = screen.getByTitle(/Developer LinkedIn/i);
    expect(linkedinIcon).toBeInTheDocument();
  });
});