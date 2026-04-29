import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import EligibilityChecker from '../pages/EligibilityChecker';
import * as gemini from '../lib/gemini';

// Mock Language Context
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key1: string, key2: string) => `${key1}.${key2}`
  })
}));

describe('EligibilityChecker', () => {
  it('renders correctly', () => {
    render(<EligibilityChecker />);
    expect(screen.getByText('eligibility.title')).toBeInTheDocument();
  });

  it('shows eligible for age 18+', async () => {
    vi.spyOn(gemini, 'analyzeEligibility').mockResolvedValueOnce({
      status: 'eligible',
      explanation: 'You are eligible to vote.'
    });

    render(<EligibilityChecker />);
    
    const input = screen.getByLabelText('Enter your age') || screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '25' } });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('eligibility.eligible')).toBeInTheDocument();
      expect(screen.getByText('You are eligible to vote.')).toBeInTheDocument();
    });
  });

  it('shows ineligible for under 18', async () => {
    vi.spyOn(gemini, 'analyzeEligibility').mockResolvedValueOnce({
      status: 'ineligible',
      explanation: 'You are too young.'
    });

    render(<EligibilityChecker />);
    
    const input = screen.getByLabelText('Enter your age') || screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '15' } });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('eligibility.ineligible')).toBeInTheDocument();
      expect(screen.getByText('You are too young.')).toBeInTheDocument();
    });
  });
});
