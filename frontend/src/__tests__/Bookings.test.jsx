import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Bookings from '../pages/Booking';
import '@testing-library/jest-dom';

// Wrapper to handle React Router context
const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Bookings Page', () => {
  it('renders the header and section labels', () => {
    renderWithRouter(<Bookings />);

    expect(screen.getByText(/Reserve Your Slot/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Book Appointment/i })).toBeInTheDocument();
    
    // Check for core form labels
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Service$/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferred Date/i)).toBeInTheDocument();
  });

  it('updates state correctly when user types in the name and email', () => {
    renderWithRouter(<Bookings />);

    // Using placeholders or IDs for specific inputs
    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const emailInput = screen.getByPlaceholderText(/you@email.com/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

    expect(nameInput.value).toBe('Jane Doe');
    expect(emailInput.value).toBe('jane@example.com');
  });

  it('allows selecting a service from the dropdown', () => {
    renderWithRouter(<Bookings />);
    
    // Target the select via the ID you provided: service-select
    const serviceSelect = screen.getByLabelText(/Service/i);
    
    fireEvent.change(serviceSelect, { target: { value: 'Box Braids' } });
    
    expect(serviceSelect.value).toBe('Box Braids');
  });

  it('displays the deposit disclaimer at the bottom', () => {
    renderWithRouter(<Bookings />);
    expect(screen.getByText(/A \$25 deposit may be required/i)).toBeInTheDocument();
  });

  it('triggers handleSubmit and logs data on form submission', () => {
    const logSpy = vi.spyOn(console, 'log');
    renderWithRouter(<Bookings />);

    // 1. Fill in all REQUIRED text fields
    fireEvent.change(screen.getByPlaceholderText(/Your full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/you@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/\(000\) 000-0000/i), { target: { value: '555-0123' } });
    
    // 2. Select the REQUIRED service
    // Match the label text and ensure the value exists in your SERVICES constants
    fireEvent.change(screen.getByLabelText(/Service/i), { target: { value: 'Box Braids' } });
    
    // 3. Fill in the REQUIRED Date and Time (This is usually what's missing!)
    fireEvent.change(screen.getByLabelText(/Preferred Date/i), { target: { value: '2024-12-31' } });
    fireEvent.change(screen.getByLabelText(/Preferred Time/i), { target: { value: '09:00' } });

    // 4. Submit
    const submitButton = screen.getByRole('button', { name: /Submit Booking Request/i });
    fireEvent.click(submitButton);

    // Assert console.log was called
    expect(logSpy).toHaveBeenCalled();
    
    logSpy.mockRestore();
  });
});