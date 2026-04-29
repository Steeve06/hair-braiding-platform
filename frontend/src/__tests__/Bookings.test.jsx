import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Bookings from '../pages/Booking';
import '@testing-library/jest-dom';

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: () => <div data-testid="turnstile-mock" />
}));

vi.mock('../utils/constants', () => ({
  SERVICES: [{ id: 1, title: 'Luxury Braids' }]
}));

vi.stubGlobal('import', {
  meta: { env: { VITE_TURNSTILE_SITE_KEY: 'mock-key', VITE_API_URL: 'https://test.com' } }
});

describe('Bookings Page Final Presence Tests', () => {
  const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

  it('verifies the header and disclaimer are rendered regardless of formatting', async () => {
    renderWithRouter(<Bookings />);
    
    // 1. Flexible Header Matcher
    const header = screen.getByText((content, element) => {
      const hasText = (node) => 
        node.textContent.replace(/\s+/g, ' ').trim().includes('Book Appointment');
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    expect(header).toBeInTheDocument();

    // 2. Wait for async fields (Service list)
    expect(await screen.findByLabelText(/Service/i)).toBeInTheDocument();

    // 3. Flexible Disclaimer Matcher
    const disclaimer = screen.getByText((content, element) => {
      const hasText = (node) => 
        node.textContent.includes('$25 deposit may be required');
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    expect(disclaimer).toBeInTheDocument();
  });
});