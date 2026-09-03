import { describe, expect, it } from 'vitest';
import { getHeadingClasses } from './heading.utils';

const MB_REGEX = /mb-\d+/;

describe('getHeadingClasses', () => {
  it('returns default section classes and mb-4 spacing for empty props', () => {
    const classes = getHeadingClasses({});
    expect(classes).toBe(
      'font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-ink text-left mb-4'
    );
  });

  it('auto-derives hero size when as is h1 and size is omitted', () => {
    const classes = getHeadingClasses({ as: 'h1' });
    expect(classes).toContain(
      'text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide'
    );
  });

  it('applies display size class when size is display', () => {
    const classes = getHeadingClasses({ size: 'display' });
    expect(classes).toContain(
      'text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight'
    );
  });

  it('applies card and sub sizes correctly', () => {
    const card = getHeadingClasses({ size: 'card' });
    expect(card).toContain('text-xl sm:text-2xl font-bold');

    const sub = getHeadingClasses({ size: 'sub' });
    expect(sub).toContain('text-lg sm:text-xl font-semibold');
  });

  it('overrides default ink color with specified color', () => {
    const bronze = getHeadingClasses({ color: 'bronze' });
    expect(bronze).toContain('text-bronze');

    const parchment = getHeadingClasses({ color: 'parchment' });
    expect(parchment).toContain('text-parchment');
  });

  it('applies text alignment classes correctly', () => {
    const center = getHeadingClasses({ align: 'center' });
    expect(center).toContain('text-center');

    const right = getHeadingClasses({ align: 'right' });
    expect(right).toContain('text-right');
  });

  it('handles spacing variants correctly', () => {
    const noneSpacing = getHeadingClasses({ spacing: 'none' });
    expect(noneSpacing).not.toMatch(MB_REGEX);

    const xsSpacing = getHeadingClasses({ spacing: 'xs' });
    expect(xsSpacing).toContain('mb-1');

    const smSpacing = getHeadingClasses({ spacing: 'sm' });
    expect(smSpacing).toContain('mb-3');

    const mdSpacing = getHeadingClasses({ spacing: 'md' });
    expect(mdSpacing).toContain('mb-4');

    const lgSpacing = getHeadingClasses({ spacing: 'lg' });
    expect(lgSpacing).toContain('mb-6');
  });

  it('applies line-clamp when numeric clamp is provided', () => {
    const clamped = getHeadingClasses({ clamp: 2 });
    expect(clamped).toContain('line-clamp-2');

    const noneClamped = getHeadingClasses({ clamp: 'none' });
    expect(noneClamped).not.toContain('line-clamp');
  });
});
