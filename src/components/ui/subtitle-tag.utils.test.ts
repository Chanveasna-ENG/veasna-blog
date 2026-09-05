import { describe, expect, it } from 'vitest';
import { getSubtitleTagClasses } from './subtitle-tag.utils';

const MB_REGEX = /mb-\d+/;

describe('getSubtitleTagClasses', () => {
  it('returns default bordered bronze sm classes with mb-3 spacing for empty props', () => {
    const classes = getSubtitleTagClasses({});
    expect(classes).toBe(
      'inline-block font-heading font-semibold uppercase tracking-widest text-bronze border-bronze border bg-transparent text-xs px-3.5 py-1 mb-3'
    );
  });

  it('renders ghost variant with size sm without padding or borders', () => {
    const classes = getSubtitleTagClasses({ variant: 'ghost', size: 'sm' });
    expect(classes).toContain('border-0 bg-transparent text-xs px-0 py-0');
  });

  it('renders badge variant with size md with parchment background and larger padding', () => {
    const classes = getSubtitleTagClasses({ variant: 'badge', size: 'md' });
    expect(classes).toContain(
      'border bg-parchmentDark/60 text-xs md:text-sm px-4 py-1'
    );
  });

  it('omits margin class when spacing is none', () => {
    const classes = getSubtitleTagClasses({ spacing: 'none' });
    expect(classes).not.toMatch(MB_REGEX);
  });

  it('applies mb-2 spacing when spacing is xs', () => {
    const classes = getSubtitleTagClasses({ spacing: 'xs' });
    expect(classes).toContain('mb-2');
  });

  it('applies mb-4 spacing when spacing is md', () => {
    const classes = getSubtitleTagClasses({ spacing: 'md' });
    expect(classes).toContain('mb-4');
  });

  it('applies mb-6 spacing when spacing is lg', () => {
    const classes = getSubtitleTagClasses({ spacing: 'lg' });
    expect(classes).toContain('mb-6');
  });

  it('applies ink and gold color tokens correctly', () => {
    const inkClasses = getSubtitleTagClasses({ color: 'ink' });
    expect(inkClasses).toContain('text-ink border-ink');

    const goldClasses = getSubtitleTagClasses({ color: 'gold' });
    expect(goldClasses).toContain('text-gold border-gold');
  });
});
