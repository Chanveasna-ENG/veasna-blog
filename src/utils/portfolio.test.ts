import { describe, expect, it } from 'vitest';
import { extractUniqueProjectTags, matchesProjectTag } from './portfolio';

describe('extractUniqueProjectTags', () => {
  it('deduplicates and sorts tags case-insensitively', () => {
    const projects = [
      { data: { tags: ['Automation', 'n8n', 'docker'] } },
      { data: { tags: ['Docker', 'TypeScript', 'AUTOMATION'] } },
      { tags: ['Redis', 'Webhooks'] }
    ];

    const uniqueTags = extractUniqueProjectTags(projects);
    expect(uniqueTags).toEqual([
      'Automation',
      'docker',
      'n8n',
      'Redis',
      'TypeScript',
      'Webhooks'
    ]);
  });

  it('returns empty array when project list is empty or tags missing', () => {
    expect(extractUniqueProjectTags([])).toEqual([]);
    expect(extractUniqueProjectTags([{ data: {} }, { tags: [] }])).toEqual([]);
  });
});

describe('matchesProjectTag', () => {
  it('returns true when filterTag is all or empty', () => {
    expect(matchesProjectTag(['Automation', 'n8n'], 'all')).toBe(true);
    expect(matchesProjectTag(['Automation', 'n8n'], 'All')).toBe(true);
    expect(matchesProjectTag(['Automation', 'n8n'], '')).toBe(true);
  });

  it('matches tag case-insensitively', () => {
    expect(matchesProjectTag(['Automation', 'n8n'], 'automation')).toBe(true);
    expect(matchesProjectTag(['Automation', 'n8n'], 'AUTOMATION')).toBe(true);
    expect(matchesProjectTag(['Automation', 'n8n'], 'N8N')).toBe(true);
  });

  it('returns false when tag is not present', () => {
    expect(matchesProjectTag(['Automation', 'n8n'], 'docker')).toBe(false);
  });
});
