/* eslint-disable no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminLoginModal from '../components/common/AdminLoginModal';
import '@testing-library/jest-dom';

describe('AdminLoginModal', () => {
  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByText(/Admin Login/i)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);
    
    expect(screen.getByRole('heading', { name: /Admin Login/i })).toBeInTheDocument();
    // ✅ FIXED: inputs now start empty, not with hardcoded credentials
    expect(screen.getByLabelText(/USERNAME/i)).toHaveValue('');
    expect(screen.getByLabelText(/PASSWORD/i)).toHaveValue('');
  });

  it('calls onClose when the close button (X) is clicked', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('updates username and password fields on user input', () => {
    const onClose = vi.fn();
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);

    const usernameInput = screen.getByLabelText(/USERNAME/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);

    fireEvent.change(usernameInput, { target: { value: 'testadmin' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });

    expect(usernameInput).toHaveValue('testadmin');
    expect(passwordInput).toHaveValue('testpass123');
  });
});