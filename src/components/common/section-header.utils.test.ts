import { describe, expect, it } from 'vitest';
import {
  resolveDividerConfig,
  resolveHeadingSpacing
} from './section-header.utils';

describe('resolveHeadingSpacing', () => {
  it('returns sm spacing when description is present and divider is enabled', () => {
    expect(resolveHeadingSpacing(true, true)).toBe('sm');
  });

  it('returns sm spacing when description is present and divider is disabled', () => {
    expect(resolveHeadingSpacing(true, false)).toBe('sm');
  });

  it('returns md spacing when description is absent and divider is enabled', () => {
    expect(resolveHeadingSpacing(false, true)).toBe('md');
  });

  it('returns none spacing when neither description nor divider is present', () => {
    expect(resolveHeadingSpacing(false, false)).toBe('none');
  });
});

describe('resolveDividerConfig', () => {
  it('defaults to feather divider when divider is undefined', () => {
    expect(resolveDividerConfig(undefined)).toEqual({
      show: true,
      variant: 'feather'
    });
  });

  it('disables divider when divider is false', () => {
    expect(resolveDividerConfig(false)).toEqual({
      show: false,
      variant: 'feather'
    });
  });

  it('enables feather divider when divider is true', () => {
    expect(resolveDividerConfig(true)).toEqual({
      show: true,
      variant: 'feather'
    });
  });

  it('uses custom divider variant when string is passed', () => {
    expect(resolveDividerConfig('diamond')).toEqual({
      show: true,
      variant: 'diamond'
    });
  });
});
