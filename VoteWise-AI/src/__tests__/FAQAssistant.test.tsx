import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ChatBot from '../components/ChatBot';
import * as gemini from '../lib/gemini';

// Mock Contexts
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'English',
    t: (k1: string, k2: string) => `${k1}.${k2}`
  })
}));

describe('ChatBot FAQ Integration', () => {
  it('responds correctly to keywords via getGeminiResponse', async () => {
    vi.spyOn(gemini, 'getGeminiResponse').mockResolvedValueOnce('Indian citizens aged 18+ can vote.');

    render(<ChatBot />);
    
    // Open chatbot if it's a modal/floating
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'who can vote' } });
    
    const sendBtn = screen.getByLabelText(/send message/i);
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('Indian citizens aged 18+ can vote.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
