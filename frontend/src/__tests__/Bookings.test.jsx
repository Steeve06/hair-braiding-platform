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

  it('verifies primary elements are rendered', async () => {
    renderWithRouter(<Bookings />);
    
    // Check Header
    expect(screen.getByText((content) => content.includes('Book Appointment'))).toBeInTheDocument();
    
    // Check Async Labels
    expect(await screen.findByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Service/i)).toBeInTheDocument();
    
    // Check Disclaimer
    expect(screen.getByText((content) => content.includes('$25 deposit'))).toBeInTheDocument();
  });
});