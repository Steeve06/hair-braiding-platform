import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '../components/layout/Hero';
import '@testing-library/jest-dom';

describe('Hero Component', () => {
  it('renders the main luxury branding text', () => {
    render(<Hero />);
    
    // Checks for the main heading text
    const heading = screen.getByText(/The Art of/i);
    // Updated to match "Styled Braids" from your file
    const accentedHeading = screen.getByText(/Styled Braids/i); 
    
    expect(heading).toBeInTheDocument();
    expect(accentedHeading).toBeInTheDocument();
  });

  it('renders the "Book Appointment" call to action', () => {
    render(<Hero />);
    const bookingButton = screen.getByRole('button', { name: /book appointment/i });
    expect(bookingButton).toBeInTheDocument();
  });

  it('displays the location tag', () => {
    render(<Hero />);
    // This is good—partial match works well for "Luxury Braiding Studio · Atlanta, GA"
    expect(screen.getByText(/Atlanta/i)).toBeInTheDocument();
  });
});