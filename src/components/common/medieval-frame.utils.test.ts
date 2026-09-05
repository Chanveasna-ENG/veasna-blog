import { describe, expect, it } from 'vitest';
import {
  resolveBackgroundClass,
  resolveCornerSize,
  resolveInteractiveClass,
  resolveMedievalFrameConfig,
  resolvePaddingClass
} from './medieval-frame.utils';

describe('medieval-frame.utils', () => {
  it('resolves corner sizes correctly', () => {
    expect(resolveCornerSize()).toBe(48);
    expect(resolveCornerSize('small')).toBe(48);
    expect(resolveCornerSize('medium')).toBe(69);
    expect(resolveCornerSize('big')).toBe(150);
  });

  it('resolves padding classes correctly', () => {
    expect(resolvePaddingClass()).toBe('p-6 sm:p-8');
    expect(resolvePaddingClass('small')).toBe('p-6 sm:p-8');
    expect(resolvePaddingClass('medium')).toBe('p-8 sm:p-10');
    expect(resolvePaddingClass('big')).toBe('p-8 sm:p-12 md:p-16');
  });

  it('resolves background classes correctly', () => {
    expect(resolveBackgroundClass()).toBe('bg-parchment/50');
    expect(resolveBackgroundClass('parchment')).toBe('bg-parchment/50');
    expect(resolveBackgroundClass('transparent')).toBe('bg-transparent');
  });

  it('resolves interactive classes correctly', () => {
    expect(resolveInteractiveClass(false)).toBe('');
    expect(resolveInteractiveClass(true)).toContain('engraved-shadow');
    expect(resolveInteractiveClass(true)).toContain('hover:border-bronze');
  });

  it('resolves default config with small, parchment, and div', () => {
    const config = resolveMedievalFrameConfig();
    expect(config.cornerSize).toBe(48);
    expect(config.tag).toBe('div');
    expect(config.containerClass).toContain('medieval-frame');
    expect(config.containerClass).toContain('p-6 sm:p-8');
    expect(config.containerClass).toContain('bg-parchment/50');
    expect(config.containerClass).not.toContain('engraved-shadow');
  });

  it('resolves medium size with interactive shadow', () => {
    const config = resolveMedievalFrameConfig({
      size: 'medium',
      interactive: true
    });
    expect(config.cornerSize).toBe(69);
    expect(config.containerClass).toContain('p-8 sm:p-10');
    expect(config.containerClass).toContain('engraved-shadow');
  });

  it('resolves big size with transparent background', () => {
    const config = resolveMedievalFrameConfig({
      size: 'big',
      background: 'transparent'
    });
    expect(config.cornerSize).toBe(150);
    expect(config.containerClass).toContain('p-8 sm:p-12 md:p-16');
    expect(config.containerClass).toContain('bg-transparent');
  });

  it('resolves article tag when as="article"', () => {
    const config = resolveMedievalFrameConfig({ as: 'article' });
    expect(config.tag).toBe('article');
  });
});
