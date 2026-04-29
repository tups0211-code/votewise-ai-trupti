import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PollingBooth from '../pages/PollingBooth';

// Mock Language Context
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (k1: string, k2: string) => `${k1}.${k2}`
  })
}));

describe('PollingBooth PIN Search', () => {
  it('updates results when a valid 6-digit PIN is entered', () => {
    render(<PollingBooth />);
    
    const input = screen.getByPlaceholderText(/polling.placeholder/i);
    fireEvent.change(input, { target: { value: '123456' } });
    
    const searchBtn = screen.getByText('polling.btn');
    fireEvent.click(searchBtn);

    expect(screen.getByText('polling.results')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
    
    // Check if at least one booth name is rendered
    expect(screen.getAllByRole('heading', { level: 4 }).length).toBeGreaterThan(0);
  });

  it('shows alert for invalid PIN', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PollingBooth />);
    
    const input = screen.getByPlaceholderText(/polling.placeholder/i);
    fireEvent.change(input, { target: { value: '123' } });
    
    const searchBtn = screen.getByText('polling.btn');
    fireEvent.click(searchBtn);

    expect(alertMock).toHaveBeenCalledWith("Please enter a valid 6-digit PIN code.");
  });
});
