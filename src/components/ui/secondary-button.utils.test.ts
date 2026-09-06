import { describe, expect, it } from 'vitest';
import { resolveSecondaryButtonClasses } from './secondary-button.utils';

describe('resolveSecondaryButtonClasses', () => {
  it('resolves default md size and inactive state classes', () => {
    const { containerClass, innerLineClass } = resolveSecondaryButtonClasses();
    expect(containerClass).toContain('px-6 py-3');
    expect(containerClass).toContain('text-ink');
    expect(containerClass).toContain('bg-transparent');
    expect(innerLineClass).toContain('border-ink');
    expect(innerLineClass).toContain('opacity-30');
  });

  it('resolves compact sm size with active state classes', () => {
    const { containerClass, innerLineClass } = resolveSecondaryButtonClasses({
      size: 'sm',
      active: true,
      className: 'custom-class'
    });
    expect(containerClass).toContain('px-3.5 py-1.5 text-xs');
    expect(containerClass).toContain('text-parchment');
    expect(containerClass).toContain('bg-ink');
    expect(containerClass).toContain('custom-class');
    expect(innerLineClass).toContain('border-parchment');
    expect(innerLineClass).toContain('opacity-60');
  });

  it('resolves lg size correctly', () => {
    const { containerClass } = resolveSecondaryButtonClasses({ size: 'lg' });
    expect(containerClass).toContain('px-8 py-3.5');
  });
});
