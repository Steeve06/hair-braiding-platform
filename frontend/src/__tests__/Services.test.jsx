import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Services from '../pages/Services';
import { SERVICES } from '../utils/constants';
import '@testing-library/jest-dom';

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Services Page', () => {
  it('renders the page header correctly', () => {
    renderWithRouter(<Services />);
    
    expect(screen.getByText(/Service Menu/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Our Offerings/i })).toBeInTheDocument();
  });

  it('renders unique service details from constants', () => {
    renderWithRouter(<Services />);
    
    SERVICES.forEach((service) => {
      // 1. Find Title - must be unique h2
      const title = screen.getByRole('heading', { level: 2, name: new RegExp(service.title, 'i') });
      expect(title).toBeInTheDocument();

      // 2. Find Price - must be unique
      // Uses functional matcher to handle potential split text ($ 180) while remaining strict
      const price = screen.getByText((content, element) => {
        const hasText = (node) => node.textContent === service.price;
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element.children).every(
          child => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      });
      expect(price).toBeInTheDocument();

      // 3. Find Roman Numeral ID - must be unique
      expect(screen.getByText(service.id)).toBeInTheDocument();
    });
  });

  it('renders unique images for each service', () => {
    renderWithRouter(<Services />);
    
    SERVICES.forEach((service) => {
      // getByRole will now fail if duplicate images with the same alt text exist
      const image = screen.getByRole('img', { name: new RegExp(service.title, 'i') });
      
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', service.image);
    });
  });

  it('contains exactly one "Inquire Now" button per service', () => {
    renderWithRouter(<Services />);
    
    const buttons = screen.getAllByRole('button', { name: /book now/i });
    expect(buttons.length).toBe(SERVICES.length);
  });

  it('applies the alternating layout classes (Z-pattern)', () => {
    const { container } = renderWithRouter(<Services />);
    const serviceRows = container.querySelectorAll('.flex-col.md\\:items-center');
    
    // Check first item (Even index: 0)
    if (serviceRows.length > 0) {
      expect(serviceRows[0]).toHaveClass('md:flex-row');
    }
    
    // Check second item (Odd index: 1)
    if (serviceRows.length > 1) {
      expect(serviceRows[1]).toHaveClass('md:flex-row-reverse');
    }
  });
});