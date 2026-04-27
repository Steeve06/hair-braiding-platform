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
    
    // Mock the API response
    axios.get.mockResolvedValue({ data: [mockService] });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // 1. Switch to Services Tab
    const servicesTab = screen.getByRole('button', { name: /services/i });
    fireEvent.click(servicesTab);

    // 2. Wait for the Service to appear and find the pencil
    const editButton = await screen.findByRole('button', { name: /pencil/i });
    
    // 3. Click the button
    fireEvent.click(editButton);

    // 4. Use waitFor to ensure the Modal is fully visible and state is updated
    await waitFor(() => {
      // We look for the input specifically to ensure it's the one with the value
      const titleInput = screen.getByDisplayValue('Luxury Braids');
      expect(titleInput).toBeInTheDocument();
    }, { timeout: 2000 }); // Give it extra time for the modal transition
  });
});
