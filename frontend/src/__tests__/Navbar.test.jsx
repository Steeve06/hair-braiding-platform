import Navbar from '../components/layout/Navbar';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders Navbar with brand logo and navigation links', () => {
  render(<Navbar />);
  
  // Check for the Logo (Brand Name)
  const brandPart1 = screen.getByText(/Styled/i);
  const brandPart2 = screen.getByText(/By Miah/i);
  expect(brandPart1).toBeInTheDocument();
  expect(brandPart2).toBeInTheDocument();

  // Check for navigation links
  const servicesLink = screen.getByText(/Services/i);
  const bookingsLink = screen.getByText(/Bookings/i);
  expect(servicesLink).toBeInTheDocument();
  expect(bookingsLink).toBeInTheDocument();

  // Check for Admin button
  const adminButton = screen.getByRole('button', { name: /admin/i });
  expect(adminButton).toBeInTheDocument();
});
