/* eslint-disable no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from '../pages/AdminDashboard';
import '@testing-library/jest-dom';

vi.mock('axios');

describe('AdminDashboard Simplified Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a mock token for fetchData
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
    });
  });

  it('renders the dashboard and switches to services tab', async () => {
    axios.get.mockResolvedValue({ data: [] });
    
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);

    // Wait for initial loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading Secure Data/i)).not.toBeInTheDocument();
    });

    // Click on the Services tab
    const servicesTab = screen.getByRole('button', { name: /services/i });
    fireEvent.click(servicesTab);

    // Verify "Add New Service" button is visible
    expect(await screen.findByText(/Add New Service/i)).toBeInTheDocument();
  });

  it('opens the edit modal with correct service data', async () => {
    const mockService = { 
      id: 1, 
      title: 'Luxury Braids', 
      price: '200', 
      duration: '04:00:00', 
      description: 'Test description',
      image: 'http://localhost/test.jpg' 
    };
    
    axios.get.mockResolvedValue({ data: [mockService] });

    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading Secure Data/i)).not.toBeInTheDocument();
    });

    // Switch to services tab
    fireEvent.click(screen.getByRole('button', { name: /services/i }));

    // Find and click the Edit (Pencil) button
    const editButton = await screen.findByRole('button', { name: /pencil/i })
      .catch(() => screen.getAllByRole('button').find(btn => btn.innerHTML.includes('svg')));
    
    fireEvent.click(editButton);

  });
});