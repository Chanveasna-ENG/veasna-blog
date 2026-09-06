import { describe, expect, it } from 'vitest';
import { resolveProjectCardConfig } from './project-card.utils';

describe('resolveProjectCardConfig', () => {
  const sampleProject = {
    id: 'workflow-sync',
    title: 'Autonomous CRM Sync',
    description: 'Custom n8n and Make pipelines syncing data across CRMs.',
    tags: ['Automation', 'n8n']
  };

  it('resolves default slider variant with fallback image and short label', () => {
    const config = resolveProjectCardConfig({ project: sampleProject });
    expect(config.isSlider).toBe(true);
    expect(config.imageSrc).toBe('/images/profile.jpg');
    expect(config.href).toBe('/posts/workflow-sync');
    expect(config.label).toBe('Case Study');
    expect(config.primaryTag).toBe('Automation');
  });

  it('resolves grid variant with custom image and comprehensive label', () => {
    const config = resolveProjectCardConfig({
      project: {
        ...sampleProject,
        coverImageSrc: '/images/custom-project.png',
        tags: []
      },
      variant: 'grid'
    });
    expect(config.isSlider).toBe(false);
    expect(config.imageSrc).toBe('/images/custom-project.png');
    expect(config.label).toBe('Comprehensive Case Study');
    expect(config.primaryTag).toBe('System Architecture');
  });
});
