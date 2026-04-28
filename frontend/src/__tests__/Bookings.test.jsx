import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import Bookings from '../pages/Booking';
import '@testing-library/jest-dom';

// Mock the constants to ensure the Service dropdown has options to render
vi.mock('../utils/constants', () => ({
  SERVICES: [
    { id: 1, title: 'Luxury Braids' },
    { id: 2, title: 'Knotless Braids' }
  ]
}));

describe('Bookings Page - Form Element Presence', () => {
  beforeEach(() => {
    // Mock localStorage to prevent environment errors during render
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
    expect(screen.getByText(/Book Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/— Reserve Your Slot —/i)).toBeInTheDocument();
  });

  it('verifies all interactive input fields are present by label', () => {
    renderWithRouter(<Bookings />);

    // Text & Tel Inputs
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();

    // Select Menus
    expect(screen.getByLabelText(/Service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Time/i)).toBeInTheDocument();

    // Date Input
    expect(screen.getByLabelText(/Preferred Date/i)).toBeInTheDocument();
  });

  it('verifies the Special Requests textarea is present', () => {
    renderWithRouter(<Bookings />);
    // Since "Special Requests" label doesn't have an 'htmlFor', we find by text/placeholder
    expect(screen.getByText(/Special Requests/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Hair length, desired extensions/i)).toBeInTheDocument();
  });

  it('verifies the service dropdown contains the mocked options', () => {
    renderWithRouter(<Bookings />);
    const serviceSelect = screen.getByLabelText(/Service/i);
    
    expect(serviceSelect).toContainElement(screen.getByText(/Luxury Braids/i));
    expect(serviceSelect).toContainElement(screen.getByText(/Knotless Braids/i));
  });

  it('verifies the submission button is rendered correctly', () => {
    renderWithRouter(<Bookings />);
    const submitBtn = screen.getByRole('button', { name: /Submit Booking Request/i });
    
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('verifies the policy disclaimer text is displayed', () => {
    renderWithRouter(<Bookings />);
    expect(screen.getByText(/A \$25 deposit may be required/i)).toBeInTheDocument();
  });
});