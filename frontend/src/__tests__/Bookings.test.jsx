import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Bookings from '../pages/Booking';
import '@testing-library/jest-dom';

// 1. Mock the Turnstile component so it doesn't try to load external scripts
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: () => <div data-testid="turnstile-mock" />
}));

// 2. Mock your constants
vi.mock('../utils/constants', () => ({
  SERVICES: [{ id: 1, title: 'Luxury Braids' }]
}));

// 3. Mock environment variables
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_TURNSTILE_SITE_KEY: 'mock-key',
      VITE_API_URL: 'https://test.com'
    }
  }
});

describe('Bookings Page Rendering', () => {
  const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

  it('renders the form with all essential fields', async () => {
    renderWithRouter(<Bookings />);

    // Check for the Header using its Role (most robust way)
    expect(screen.getByRole('heading', { name: /book appointment/i })).toBeInTheDocument();

    // Use findBy for the service dropdown (since it renders after a useEffect)
    const serviceSelect = await screen.findByLabelText(/service/i);
    expect(serviceSelect).toBeInTheDocument();

    // Check for other standard inputs by their labels
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();

    // Check for the disclaimer using a partial regex match
    expect(screen.getByText(/\$25 deposit/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderWithRouter(<Bookings />);
    const button = screen.getByRole('button', { name: /submit booking request/i });
    expect(button).toBeInTheDocument();
  });
});