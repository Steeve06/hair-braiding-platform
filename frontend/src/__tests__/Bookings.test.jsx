import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Bookings from '../pages/Booking';
import '@testing-library/jest-dom';

// 1. Mock Turnstile to avoid "sitekey" errors during headless testing
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: () => <div data-testid="turnstile-mock" />
}));

// 2. Mock the constants
vi.mock('../utils/constants', () => ({
  SERVICES: [
    { id: 1, title: 'Luxury Braids' },
    { id: 2, title: 'Knotless Braids' }
  ]
}));

// 3. Mock Import Meta for the Turnstile site key check
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_TURNSTILE_SITE_KEY: 'mock-key',
      VITE_API_URL: 'https://test-api.com'
    }
  }
});

describe('Bookings Page - Form Element Presence', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it('renders the main booking header', () => {
    renderWithRouter(<Bookings />);
    
    // Function matcher to handle text that might be split across nodes or have extra whitespace
    const header = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Book Appointment';
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    });
    
    expect(header).toBeInTheDocument();
  });

  it('verifies all interactive input fields are present by label', async () => {
    renderWithRouter(<Bookings />);

    // Use findBy queries to wait for the component to finish its initial useEffect/render cycle
    expect(await screen.findByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Service/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Preferred Time/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Preferred Date/i)).toBeInTheDocument();
  });

  it('verifies the Special Requests textarea is present', () => {
    renderWithRouter(<Bookings />);
    expect(screen.getByLabelText(/Special Requests/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Hair length, desired extensions/i)).toBeInTheDocument();
  });

  it('verifies the service dropdown contains the mocked options', async () => {
    renderWithRouter(<Bookings />);
    
    // Wait for the service options to be populated from the state
    const luxuryOption = await screen.findByText('Luxury Braids');
    const knotlessOption = await screen.findByText('Knotless Braids');
    
    expect(luxuryOption).toBeInTheDocument();
    expect(knotlessOption).toBeInTheDocument();
  });

  it('verifies the submission button is rendered correctly', () => {
    renderWithRouter(<Bookings />);
    const submitBtn = screen.getByRole('button', { name: /Submit Booking Request/i });
    
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('verifies the policy disclaimer text is displayed', () => {
    renderWithRouter(<Bookings />);
    
    // Using a substring matcher to find the disclaimer regardless of exact spacing
    const disclaimer = screen.getByText((content) => {
      return content.includes('A $25 deposit may be required');
    });
    
    expect(disclaimer).toBeInTheDocument();
  });
});