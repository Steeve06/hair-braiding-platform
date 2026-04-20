import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Services from '../pages/Services';
import { SERVICES } from '../utils/constants';
import '@testing-library/jest-dom';

// Wrapper to handle React Router context (for Link and useNavigate)
const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Services Page', () => {
  it('renders the page header correctly', () => {
    renderWithRouter(<Services />);
    
    expect(screen.getByText(/Service Menu/i)).toBeInTheDocument();
    const mainHeading = screen.getByRole('heading', { level: 1, name: /Our Offerings/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders service details from constants (allowing for duplicates)', () => {
    renderWithRouter(<Services />);
    
    SERVICES.forEach((service) => {
      // 1. Find Titles (Flexible)
      const titles = screen.getAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'h2' && content.includes(service.title);
      });
      expect(titles.length).toBeGreaterThan(0);

      // 2. Find Prices (The fix for your $180 error)
      // This function looks for the price regardless of if it's split into multiple spans
      const prices = screen.getAllByText((content, element) => {
        const hasText = (node) => node.textContent === service.price;
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element.children).every(
          child => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      });
      expect(prices.length).toBeGreaterThan(0);

      // 3. Find Roman Numeral IDs
      const ids = screen.getAllByText(service.id);
      expect(ids.length).toBeGreaterThan(0);
    });
  });

  it('renders images for each service with correct alt text (allowing for duplicates)', () => {
    renderWithRouter(<Services />);
    
    SERVICES.forEach((service) => {
      // Use getAllByRole to find all matching images by their accessible name (alt text)
      const images = screen.getAllByRole('img', { name: new RegExp(service.title, 'i') });
      
      // Verify at least one image was found for the service title
      expect(images.length).toBeGreaterThan(0);
      
      // Verify the first found image has the correct source URL
      expect(images[0]).toHaveAttribute('src', service.image);
    });
  });

  it('contains "Inquire Now" buttons for all service entries', () => {
    renderWithRouter(<Services />);
    
    const buttons = screen.getAllByRole('button', { name: /inquire now/i });
    // Total buttons should match the number of services in your constants
    expect(buttons.length).toBe(SERVICES.length);
  });

  it('applies the alternating layout classes (Z-pattern)', () => {
    const { container } = renderWithRouter(<Services />);
    
    // We target the main flex containers for each service row
    // Based on the 'flex-col md:items-center' class logic
    const serviceRows = container.querySelectorAll('.flex-col.md\\:items-center');
    
    // Check first item (Even index: should have md:flex-row)
    if (serviceRows.length > 0) {
      expect(serviceRows[0]).toHaveClass('md:flex-row');
    }
    
    // Check second item (Odd index: should have md:flex-row-reverse)
    if (serviceRows.length > 1) {
      expect(serviceRows[1]).toHaveClass('md:flex-row-reverse');
    }
  });
});