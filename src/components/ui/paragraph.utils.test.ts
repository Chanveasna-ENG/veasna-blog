import { describe, expect, it } from 'vitest';
import { getParagraphClasses } from './paragraph.utils';

const MB_REGEX = /mb-\d+/;

describe('getParagraphClasses', () => {
  it('returns default body classes and mb-6 spacing for empty props', () => {
    const classes = getParagraphClasses({});
    expect(classes).toBe(
      'font-body text-base sm:text-lg leading-relaxed text-inkMuted text-left mb-6'
    );
  });

  it('defaults to text-ink for lead variant when color is omitted', () => {
    const classes = getParagraphClasses({ variant: 'lead' });
    expect(classes).toBe(
      'font-body text-lg sm:text-xl leading-relaxed text-ink text-left mb-6'
    );
  });

  it('defaults to text-inkMuted for small variant when color is omitted', () => {
    const classes = getParagraphClasses({ variant: 'small' });
    expect(classes).toBe(
      'font-body text-sm leading-relaxed text-inkMuted text-left mb-6'
    );
  });

  it('defaults to text-inkMuted for caption variant when color is omitted', () => {
    const classes = getParagraphClasses({ variant: 'caption' });
    expect(classes).toBe(
      'font-body text-xs italic text-inkMuted text-left mb-6'
    );
  });

  it('overrides default color when explicit color is specified', () => {
    const classes = getParagraphClasses({ variant: 'lead', color: 'bronze' });
    expect(classes).toBe(
      'font-body text-lg sm:text-xl leading-relaxed text-bronze text-left mb-6'
    );
  });

  it('applies text alignment classes correctly', () => {
    const center = getParagraphClasses({ align: 'center' });
    expect(center).toContain('text-center');

    const right = getParagraphClasses({ align: 'right' });
    expect(right).toContain('text-right');
  });

  it('applies clamp class when numeric clamp is provided', () => {
    const clamped = getParagraphClasses({ clamp: 3 });
    expect(clamped).toContain('line-clamp-3');
  });

  it('does not include clamp class when clamp is none or undefined', () => {
    const noneClamped = getParagraphClasses({ clamp: 'none' });
    expect(noneClamped).not.toContain('line-clamp');

    const undefinedClamped = getParagraphClasses({});
    expect(undefinedClamped).not.toContain('line-clamp');
  });

  it('handles spacing variants correctly', () => {
    const noneSpacing = getParagraphClasses({ spacing: 'none' });
    expect(noneSpacing).not.toMatch(MB_REGEX);

    const xsSpacing = getParagraphClasses({ spacing: 'xs' });
    expect(xsSpacing).toContain('mb-2');

    const smSpacing = getParagraphClasses({ spacing: 'sm' });
    expect(smSpacing).toContain('mb-4');

    const mdSpacing = getParagraphClasses({ spacing: 'md' });
    expect(mdSpacing).toContain('mb-6');

    const lgSpacing = getParagraphClasses({ spacing: 'lg' });
    expect(lgSpacing).toContain('mb-8');
  });
});
