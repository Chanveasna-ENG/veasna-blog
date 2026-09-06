const RAW_P_REGEX = /<p(\s|>|$)|<\/p>/i;
const RAW_HEADING_REGEX = /<(\/)?h([1-6])(\s|>|$)/i;
const PARAGRAPH_TAG_REGEX = /<Paragraph\b([^>]*)>/gs;
const HEADING_TAG_REGEX = /<Heading\b([^>]*)>/gs;
const SUBTITLE_TAG_REGEX = /<SubtitleTag\b([^>]*)>/gs;
const SECTION_HEADER_TAG_REGEX = /<SectionHeader\b([^>]*)>/gs;
const MEDIEVAL_FRAME_TAG_REGEX = /<MedievalFrame\b([^>]*)>/gs;
const ACCORDION_TAG_REGEX = /<Accordion\b([^>]*)>/gs;
const PROJECT_CARD_TAG_REGEX = /<ProjectCard\b([^>]*)>/gs;
const CHECKLIST_TAG_REGEX = /<Checklist\b([^>]*)>/gs;
const CLASS_PROP_REGEX = /\b(className|class)\s*=/i;

/**
 * Checks a line for raw p or heading tags.
 * @param {string} line
 * @param {number} lineNumber
 * @param {boolean} isParagraphComponent
 * @param {boolean} isHeadingComponent
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkLineTags(
  line,
  lineNumber,
  isParagraphComponent,
  isHeadingComponent
) {
  const lineViolations = [];
  const trimmed = line.trim();

  if (
    trimmed.startsWith('<!--') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('*')
  ) {
    return lineViolations;
  }

  if (!isParagraphComponent && RAW_P_REGEX.test(line)) {
    lineViolations.push({
      rule: 'no-raw-p',
      line: lineNumber,
      message:
        'Forbidden raw <p> tag. Use atomic <Paragraph> component instead.'
    });
  }

  if (!isHeadingComponent) {
    const headingMatch = line.match(RAW_HEADING_REGEX);
    if (headingMatch) {
      lineViolations.push({
        rule: 'no-raw-heading',
        line: lineNumber,
        message: `Forbidden raw <${headingMatch[1] || ''}h${headingMatch[2]}> tag. Use atomic <Heading as="h${headingMatch[2]}"> component instead.`
      });
    }
  }

  return lineViolations;
}

/**
 * Checks content for forbidden className or class props on Paragraph components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkParagraphClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(PARAGRAPH_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-paragraph-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <Paragraph>. Offload spacing and layout to parent containers.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on Heading components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkHeadingClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(HEADING_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-heading-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <Heading>. Use design tokens and layout containers.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on SubtitleTag components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkSubtitleTagClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(SUBTITLE_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-subtitletag-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <SubtitleTag>. Use spacing prop or parent containers.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on SectionHeader components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkSectionHeaderClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(SECTION_HEADER_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-sectionheader-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <SectionHeader>. Layout is encapsulated.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on MedievalFrame components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkMedievalFrameClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(MEDIEVAL_FRAME_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-medievalframe-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <MedievalFrame>. Layout and borders are encapsulated.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on Accordion components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkAccordionClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(ACCORDION_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-accordion-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <Accordion>. Layout and borders are encapsulated.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on ProjectCard components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkProjectCardClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(PROJECT_CARD_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-projectcard-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <ProjectCard>. Layout and borders are encapsulated.'
      });
    }
  }

  return propViolations;
}

/**
 * Checks content for forbidden className or class props on Checklist components.
 * @param {string} content
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
function checkChecklistClassProps(content) {
  const propViolations = [];
  const matches = content.matchAll(CHECKLIST_TAG_REGEX);

  for (const match of matches) {
    const attrs = match[1];
    if (CLASS_PROP_REGEX.test(attrs)) {
      const upToMatch = content.slice(0, match.index);
      const lineNumber = upToMatch.split('\n').length;
      propViolations.push({
        rule: 'no-checklist-classname',
        line: lineNumber,
        message:
          'Forbidden className or class prop on <Checklist>. Layout and spacing are encapsulated.'
      });
    }
  }

  return propViolations;
}

/**
 * Validates an Astro template string against atomic typography and styling rules.
 * @param {string} content - Full file content of the .astro file
 * @param {string} filePath - Path to the file being validated
 * @returns {Array<{ rule: string, line: number, message: string }>}
 */
export function validateAstroTemplate(content, filePath = '') {
  const violations = [];
  const isParagraphComponent = filePath.endsWith('Paragraph.astro');
  const isHeadingComponent = filePath.endsWith('Heading.astro');

  let templateStartLine = 1;

  if (content.startsWith('---')) {
    const secondDelimiterIndex = content.indexOf('---', 3);
    if (secondDelimiterIndex !== -1) {
      const frontmatter = content.slice(0, secondDelimiterIndex + 3);
      templateStartLine = frontmatter.split('\n').length;
    }
  }

  const lines = content.split('\n');

  for (let i = templateStartLine - 1; i < lines.length; i++) {
    const lineViolations = checkLineTags(
      lines[i],
      i + 1,
      isParagraphComponent,
      isHeadingComponent
    );
    violations.push(...lineViolations);
  }

  violations.push(...checkParagraphClassProps(content));
  violations.push(...checkHeadingClassProps(content));
  violations.push(...checkSubtitleTagClassProps(content));
  violations.push(...checkSectionHeaderClassProps(content));
  violations.push(...checkMedievalFrameClassProps(content));
  violations.push(...checkAccordionClassProps(content));
  violations.push(...checkProjectCardClassProps(content));
  violations.push(...checkChecklistClassProps(content));

  return violations;
}
