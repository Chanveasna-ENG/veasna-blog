import { describe, expect, it } from 'vitest';
import { validateAstroTemplate } from './atomic-validator.mjs';

describe('validateAstroTemplate', () => {
  it('passes on clean template using Paragraph and Heading components', () => {
    const code = `---
import Heading from './Heading.astro';
import Paragraph from './Paragraph.astro';
---
<section>
  <Heading as="h2">Section Title</Heading>
  <Paragraph>Body copy text</Paragraph>
</section>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags raw <p> tag with accurate line number', () => {
    const code = `---
const title = 'Hello';
---
<div>
  <p class="intro">Raw text</p>
</div>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-raw-p');
    expect(violations[0].line).toBe(5);
  });

  it('flags raw heading tag with accurate line number', () => {
    const code = `---
const title = 'Hello';
---
<div>
  <h2>Raw Heading</h2>
</div>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-raw-heading');
    expect(violations[0].line).toBe(5);
  });

  it('flags <Paragraph> with className prop on single line', () => {
    const code = `---
import Paragraph from './Paragraph.astro';
---
<Paragraph className="mb-4">Text</Paragraph>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-paragraph-classname');
    expect(violations[0].line).toBe(4);
  });

  it('flags <Paragraph> with multiline class or className prop', () => {
    const code = `---
import Paragraph from './Paragraph.astro';
---
<div>
  <Paragraph
    variant="lead"
    className="mb-4 text-center"
  >
    Text
  </Paragraph>
</div>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-paragraph-classname');
    expect(violations[0].line).toBe(5);
  });

  it('exempts Paragraph.astro from raw <p> check', () => {
    const code = `---
import { getParagraphClasses } from './paragraph.utils';
const Tag = as;
---
<Tag class={classes}>
  <slot />
</Tag>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/ui/Paragraph.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <Heading> with className or class prop', () => {
    const code = `---
import Heading from './Heading.astro';
---
<Heading className="mb-4">Title</Heading>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-heading-classname');
    expect(violations[0].line).toBe(4);
  });

  it('exempts Heading.astro from raw heading check', () => {
    const code = `---
const Tag = as;
---
<Tag class={classes}>
  <slot />
</Tag>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/ui/Heading.astro'
    );
    expect(violations).toHaveLength(0);
  });
});
