import { describe, expect, it } from 'vitest';
import {
  resolveDividerConfig,
  resolveHeaderConfig,
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
  it('defaults to feather divider when divider is undefined and defaultShow is true', () => {
    expect(resolveDividerConfig(undefined)).toEqual({
      show: true,
      variant: 'feather'
    });
  });

  it('honors defaultShow false when divider is undefined', () => {
    expect(resolveDividerConfig(undefined, false)).toEqual({
      show: false,
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

describe('resolveHeaderConfig', () => {
  it('resolves size="normal" default correctly', () => {
    const config = resolveHeaderConfig(
      { subtitle: 'Sub', title: 'Title' },
      true
    );
    expect(config.align).toBe('center');
    expect(config.as).toBe('h2');
    expect(config.headingSize).toBe('section');
    expect(config.headingSpacing).toBe('sm');
    expect(config.subtitleSize).toBe('sm');
    expect(config.paragraphVariant).toBe('lead');
    expect(config.showDivider).toBe(true);
    expect(config.dividerVariant).toBe('feather');
    expect(config.containerClass).toContain('max-w-5xl mx-auto');
    expect(config.containerClass).toContain('mt-6 md:mt-8 mb-6 md:mb-8');
  });

  it('resolves size="normal" with divider={false} and no description to spacing="none"', () => {
    const config = resolveHeaderConfig(
      { subtitle: 'Sub', title: 'Title', divider: false },
      false
    );
    expect(config.showDivider).toBe(false);
    expect(config.headingSpacing).toBe('none');
  });

  it('resolves size="big" with hero defaults', () => {
    const config = resolveHeaderConfig(
      { size: 'big', subtitle: 'Hero Sub', title: 'Hero Title' },
      true
    );
    expect(config.align).toBe('center');
    expect(config.as).toBe('h1');
    expect(config.headingSize).toBe('hero');
    expect(config.headingSpacing).toBe('lg');
    expect(config.subtitleSize).toBe('md');
    expect(config.subtitleSpacing).toBe('lg');
    expect(config.paragraphVariant).toBe('lead');
    expect(config.showDivider).toBe(false);
    expect(config.containerClass).toBe(
      'max-w-4xl mx-auto flex flex-col items-center text-center mb-8'
    );
  });

  it('resolves size="big" with explicit divider', () => {
    const config = resolveHeaderConfig(
      { size: 'big', subtitle: 'Sub', title: 'Title', divider: 'diamond' },
      false
    );
    expect(config.showDivider).toBe(true);
    expect(config.dividerVariant).toBe('diamond');
  });

  it('resolves size="small" with compact card defaults', () => {
    const config = resolveHeaderConfig(
      { size: 'small', subtitle: 'Step 01', title: 'Card Title' },
      true
    );
    expect(config.align).toBe('left');
    expect(config.as).toBe('h3');
    expect(config.headingSize).toBe('card');
    expect(config.headingSpacing).toBe('sm');
    expect(config.paragraphVariant).toBe('small');
    expect(config.showDivider).toBe(false);
    expect(config.containerClass).toBe(
      'w-full flex flex-col items-start text-left'
    );
  });

  it('resolves size="small" with custom as="h2", headingSize="section", and divider="diamond"', () => {
    const config = resolveHeaderConfig(
      {
        size: 'small',
        as: 'h2',
        headingSize: 'section',
        subtitle: 'Sub',
        title: 'Title',
        divider: 'diamond'
      },
      true
    );
    expect(config.as).toBe('h2');
    expect(config.headingSize).toBe('section');
    expect(config.showDivider).toBe(true);
    expect(config.dividerVariant).toBe('diamond');
  });

  it('resolves size="small" with custom align="center"', () => {
    const config = resolveHeaderConfig(
      { size: 'small', align: 'center', subtitle: 'Sub', title: 'Title' },
      false
    );
    expect(config.align).toBe('center');
    expect(config.containerClass).toBe(
      'w-full flex flex-col items-center text-center'
    );
  });

  it('resolves config without subtitle without errors', () => {
    const config = resolveHeaderConfig(
      { size: 'big', title: 'Title Only' },
      true
    );
    expect(config.as).toBe('h1');
    expect(config.headingSize).toBe('hero');
  });

  it('honors paragraphVariant override on small and big variants', () => {
    const smallConfig = resolveHeaderConfig(
      { size: 'small', title: 'Title', paragraphVariant: 'lead' },
      true
    );
    expect(smallConfig.paragraphVariant).toBe('lead');

    const bigConfig = resolveHeaderConfig(
      { size: 'big', title: 'Title', paragraphVariant: 'body' },
      true
    );
    expect(bigConfig.paragraphVariant).toBe('body');
  });
});
