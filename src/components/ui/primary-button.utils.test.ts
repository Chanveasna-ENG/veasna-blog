import { describe, expect, it } from 'vitest';
import { resolvePrimaryButtonClasses } from './primary-button.utils';

describe('resolvePrimaryButtonClasses', () => {
  it('resolves default lg size and inline layout', () => {
    const { containerClass, innerLineClass } = resolvePrimaryButtonClasses();
    expect(containerClass).toContain('px-8 py-3.5 text-lg');
    expect(containerClass).toContain('inline-flex items-center justify-center');
    expect(containerClass).not.toContain('w-full');
    expect(innerLineClass).toContain('border-bronze');
    expect(innerLineClass).toContain('opacity-60');
  });

  it('resolves md size correctly', () => {
    const { containerClass } = resolvePrimaryButtonClasses({ size: 'md' });
    expect(containerClass).toContain('px-6 py-2.5 text-base');
  });

  it('resolves sm size correctly', () => {
    const { containerClass } = resolvePrimaryButtonClasses({ size: 'sm' });
    expect(containerClass).toContain('px-4 py-2 text-sm');
  });

  it('applies fullWidth layout classes when fullWidth is true', () => {
    const { containerClass } = resolvePrimaryButtonClasses({ fullWidth: true });
    expect(containerClass).toContain('w-full text-center justify-center');
    expect(containerClass).not.toContain('inline-flex');
  });

  it('keeps inline layout when fullWidth is false', () => {
    const { containerClass } = resolvePrimaryButtonClasses({
      fullWidth: false
    });
    expect(containerClass).toContain('inline-flex items-center justify-center');
    expect(containerClass).not.toContain('w-full');
  });
});
