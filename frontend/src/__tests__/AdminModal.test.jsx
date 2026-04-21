/* eslint-disable no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminLoginModal from '../components/common/AdminLoginModal';
import '@testing-library/jest-dom';

describe('AdminLoginModal', () => {
  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);
    
    expect(screen.getByRole('heading', { name: /Admin Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/USERNAME/i)).toHaveValue('admin');
    expect(screen.getByLabelText(/PASSWORD/i)).toHaveValue('braid2023');
  });

  it('calls onClose when the close button (X) is clicked', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});