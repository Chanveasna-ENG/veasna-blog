import { describe, expect, it } from 'vitest';
import { resolveSecondaryButtonClasses } from './secondary-button.utils';

describe('resolveSecondaryButtonClasses', () => {
  it('resolves default md size, inactive state, and inline layout', () => {
    const { containerClass, innerLineClass } = resolveSecondaryButtonClasses();
    expect(containerClass).toContain('px-6 py-3');
    expect(containerClass).toContain('text-ink');
    expect(containerClass).toContain('bg-transparent');
    expect(containerClass).toContain('inline-flex items-center justify-center');
    expect(containerClass).not.toContain('w-full');
    expect(innerLineClass).toContain('border-ink');
    expect(innerLineClass).toContain('opacity-30');
  });

  it('resolves compact sm size with active state classes', () => {
    const { containerClass, innerLineClass } = resolveSecondaryButtonClasses({
      size: 'sm',
      active: true
    });
    expect(containerClass).toContain('px-3.5 py-1.5 text-xs');
    expect(containerClass).toContain('text-parchment');
    expect(containerClass).toContain('bg-crimson');
    expect(containerClass).toContain('border-crimson');
    expect(containerClass).not.toContain('bg-ink');
    expect(innerLineClass).toContain('border-parchment');
    expect(innerLineClass).toContain('opacity-60');
  });

  it('resolves lg size correctly', () => {
    const { containerClass } = resolveSecondaryButtonClasses({ size: 'lg' });
    expect(containerClass).toContain('px-8 py-3.5');
  });

  it('applies fullWidth layout when fullWidth is true', () => {
    const { containerClass } = resolveSecondaryButtonClasses({
      fullWidth: true
    });
    expect(containerClass).toContain(
      'w-full flex items-center justify-center text-center'
    );
    expect(containerClass).not.toContain('inline-flex');
  });
});
