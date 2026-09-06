import { describe, expect, it } from 'vitest';
import { formatStartingPrice, getInquiryUrl, getPricingTiers } from './pricing';

describe('Pricing Utility', () => {
  it('formats starting USD prices with currency symbol and commas', () => {
    expect(formatStartingPrice(600)).toBe('$600');
    expect(formatStartingPrice(2500)).toBe('$2,500');
    expect(formatStartingPrice(10000)).toBe('$10,000');
  });

  it('formats other currency codes when provided', () => {
    expect(formatStartingPrice(500, 'EUR')).toBe('500 EUR');
  });

  it('returns exactly 3 defined pricing tiers with correct IDs', () => {
    const tiers = getPricingTiers();
    expect(tiers).toHaveLength(3);
    expect(tiers.map((t) => t.id)).toEqual(['automation', 'bots', 'ai-web']);
    expect(tiers[0].startingPrice).toBe(600);
    expect(tiers[1].startingPrice).toBe(900);
    expect(tiers[2].startingPrice).toBe(2500);
  });

  it('encodes inquiry URL with subject parameter properly', () => {
    expect(getInquiryUrl('n8n Workflow Automation')).toBe(
      '/contact?subject=n8n%20Workflow%20Automation'
    );
  });
});
