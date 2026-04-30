import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Services from '../pages/Services';
import '@testing-library/jest-dom';

vi.mock('axios');

const mockServices = [
  {
    id: 1,
    title: "Luxury Braids",
    description: "Premium service",
    price: "$200",
    duration: "4 Hours",
    image: "http://example.com/image.jpg"
  }
];

const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

describe('Services Page', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockServices });
  });

  it('renders the loading state initially', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders services fetched from the API', async () => {
    renderWithRouter(<Services />);
    
    await waitFor(() => {
      expect(screen.getByText(/Luxury Braids/i)).toBeInTheDocument();
      
    });

    const image = screen.getByRole('img', { name: /Luxury Braids/i });
    expect(image).toHaveAttribute('src', 'http://example.com/image.jpg');
  });
});