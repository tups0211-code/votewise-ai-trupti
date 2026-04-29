import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PledgeModal from '../components/PledgeModal';

// Mock Language Context
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (k1: string, k2: string) => `${k1}.${k2}`
  })
}));

describe('PledgeModal Flow', () => {
  it('completes the pledge process', async () => {
    const onClose = vi.fn();
    render(<PledgeModal isOpen={true} onClose={onClose} />);
    
    // Step 1: Click the pledge button
    const pledgeBtn = screen.getByRole('button', { name: /pledge.btn/i });
    fireEvent.click(pledgeBtn);

    // Step 2: Certification
    expect(screen.getByText(/pledge.completeTitle/i)).toBeInTheDocument();
    
    // The component doesn't show the name because there was no input
  });
});
