import { describe, expect, it } from 'vitest';
import { resolveChecklistConfig } from './checklist.utils';

describe('resolveChecklistConfig', () => {
  it('resolves default config with check bullet, sm spacing, and no border', () => {
    const config = resolveChecklistConfig({ items: ['Task 1', 'Task 2'] });
    expect(config.bulletSymbol).toBe('✓');
    expect(config.bulletClass).toContain('text-bronze font-bold');
    expect(config.containerClass).toBe('space-y-2');
  });

  it('resolves diamond bullet config with offset class', () => {
    const config = resolveChecklistConfig({
      items: ['Deliverable 1'],
      bullet: 'diamond'
    });
    expect(config.bulletSymbol).toBe('✦');
    expect(config.bulletClass).toContain('mt-0.5');
  });

  it('appends top border and padding when borderTop is true', () => {
    const config = resolveChecklistConfig({
      items: ['Skill 1'],
      borderTop: true
    });
    expect(config.containerClass).toContain('border-t border-ink/10 pt-4');
  });

  it('resolves md spacing with space-y-2.5', () => {
    const config = resolveChecklistConfig({
      items: ['Item 1'],
      spacing: 'md'
    });
    expect(config.containerClass).toContain('space-y-2.5');
  });
});
