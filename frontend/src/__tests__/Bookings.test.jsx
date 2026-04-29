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

describe('Bookings Page Tests', () => {
  const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

  it('verifies the header and form elements are rendered correctly', async () => {
    renderWithRouter(<Bookings />);
    
    // 1. FIX: Robust Header Matcher
    const header = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Book Appointment';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    expect(header).toBeInTheDocument();

    // 2. Async Labels (wait for useEffect)
    expect(await screen.findByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Service/i)).toBeInTheDocument();
    
    // 3. FIX: Robust Disclaimer Matcher
    const disclaimer = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent.includes('$25 deposit may be required');
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    expect(disclaimer).toBeInTheDocument();
  });
});