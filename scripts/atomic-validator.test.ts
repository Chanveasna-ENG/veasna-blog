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

  it('flags <SubtitleTag> with className prop', () => {
    const code = `---
import SubtitleTag from './SubtitleTag.astro';
---
<SubtitleTag className="mb-3">Eyebrow</SubtitleTag>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-subtitletag-classname');
    expect(violations[0].line).toBe(4);
  });

  it('flags <SubtitleTag> with multiline class or className prop', () => {
    const code = `---
import SubtitleTag from './SubtitleTag.astro';
---
<div>
  <SubtitleTag
    variant="bordered"
    className="mb-4"
  >
    Eyebrow
  </SubtitleTag>
</div>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-subtitletag-classname');
    expect(violations[0].line).toBe(5);
  });

  it('passes on clean template using SubtitleTag with spacing prop', () => {
    const code = `---
import SubtitleTag from './SubtitleTag.astro';
---
<section>
  <SubtitleTag variant="bordered" spacing="sm">Eyebrow</SubtitleTag>
</section>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <SectionHeader> with className prop', () => {
    const code = `---
import SectionHeader from './SectionHeader.astro';
---
<SectionHeader subtitle="Sub" title="Title" className="mb-4" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-sectionheader-classname');
    expect(violations[0].line).toBe(4);
  });

  it('flags <SectionHeader> with multiline class or className prop', () => {
    const code = `---
import SectionHeader from './SectionHeader.astro';
---
<div>
  <SectionHeader
    subtitle="Sub"
    title="Title"
    className="custom-header"
  />
</div>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-sectionheader-classname');
    expect(violations[0].line).toBe(5);
  });

  it('passes on clean template using SectionHeader', () => {
    const code = `---
import SectionHeader from './SectionHeader.astro';
---
<section>
  <SectionHeader
    subtitle="Sub"
    title="Title"
    description="Description text"
  />
</section>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <MedievalFrame> with class or className prop', () => {
    const code = `---
import MedievalFrame from './MedievalFrame.astro';
---
<MedievalFrame className="custom-shadow">
  Content
</MedievalFrame>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-medievalframe-classname');
  });

  it('passes on clean template using MedievalFrame', () => {
    const code = `---
import MedievalFrame from './MedievalFrame.astro';
---
<MedievalFrame size="small" interactive={true}>
  Content
</MedievalFrame>`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <Accordion> with class or className prop', () => {
    const code = `---
import Accordion from './Accordion.astro';
---
<Accordion items={[]} className="custom-accordion" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-accordion-classname');
  });

  it('passes on clean template using Accordion', () => {
    const code = `---
import Accordion from './Accordion.astro';
---
<Accordion items={[]} />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <ProjectCard> with class or className prop', () => {
    const code = `---
import ProjectCard from './ProjectCard.astro';
---
<ProjectCard project={p} className="custom-card" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-projectcard-classname');
  });

  it('passes on clean template using ProjectCard', () => {
    const code = `---
import ProjectCard from './ProjectCard.astro';
---
<ProjectCard project={p} variant="slider" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });

  it('flags <Checklist> with class or className prop', () => {
    const code = `---
import Checklist from './Checklist.astro';
---
<Checklist items={[]} className="custom-list" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('no-checklist-classname');
  });

  it('passes on clean template using Checklist', () => {
    const code = `---
import Checklist from './Checklist.astro';
---
<Checklist items={['Item 1']} bullet="diamond" />`;
    const violations = validateAstroTemplate(
      code,
      'src/components/Section.astro'
    );
    expect(violations).toHaveLength(0);
  });
});
