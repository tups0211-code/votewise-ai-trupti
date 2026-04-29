import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Navbar from '../components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import * as LanguageContext from '../contexts/LanguageContext';

describe('Language Switch Functionality', () => {
  it('calls setLanguage when a language button is clicked', () => {
    const setLanguageMock = vi.fn();
    vi.spyOn(LanguageContext, 'useLanguage').mockReturnValue({
      language: 'English',
      setLanguage: setLanguageMock,
      t: (k1: string, k2: string) => `${k1}.${k2}`
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Find Hindi button (HIN)
    const hindiBtn = screen.getByText('HIN');
    fireEvent.click(hindiBtn);

    expect(setLanguageMock).toHaveBeenCalledWith('Hindi');
  });
});
