import { describe, it, expect, vi } from 'vitest';
import { getGeminiResponse } from '../lib/gemini';

describe('Error Fallback States', () => {
  it('returns a fallback message when no keywords match in getGeminiResponse', async () => {
    const response = await getGeminiResponse('something random like banana');
    expect(response).toContain("Assistant");
    expect(response).toContain("Please try keywords");
  });

  it('handles invalid inputs gracefully in eligibility analyzer', async () => {
    const { analyzeEligibility } = await import('../lib/gemini');
    const result = await analyzeEligibility('not a number');
    expect(result.status).toBe('invalid');
    expect(result.explanation).toContain("numeric age");
  });
});
