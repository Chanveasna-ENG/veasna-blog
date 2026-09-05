import { expect, test } from '@playwright/test';

const EXPLORE_ALL_REGEX = /Explore All Articles/i;
const SCOPE_BUILD_REGEX = /Scope This Build/i;
const CONTACT_SUBJECT_REGEX = /#contact\?subject=/;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;
const LEAD_PARAGRAPH_REGEX =
  /font-body text-lg sm:text-xl leading-relaxed text-ink text-center mb-6/;
const HERO_HEADING_REGEX =
  /font-heading text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide text-ink text-center mb-6/;
const SECTION_HEADING_REGEX =
  /font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-ink text-center mb-4/;
const HERO_SUBTITLE_TAG_REGEX =
  /inline-block font-heading font-semibold uppercase tracking-widest text-bronze border-bronze border bg-transparent text-xs md:text-sm px-4 py-1 mb-6/;
const SERVICES_SUBTITLE_TAG_REGEX =
  /inline-block font-heading font-semibold uppercase tracking-widest text-bronze border-bronze border bg-transparent text-xs px-3.5 py-1 mb-3/;

test.describe('Homepage Expanded Sections & Navigation', () => {
  test('header renders updated navigation links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/#services'
    );
    await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/portfolio'
    );
    await expect(nav.getByRole('link', { name: 'Blogs' })).toHaveAttribute(
      'href',
      '/page/1'
    );
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });

  test('services section displays 3 core service cards with correct content', async ({
    page
  }) => {
    await page.goto('/#services');
    const servicesSection = page.locator('section#services');
    await expect(servicesSection).toBeVisible();

    await expect(
      servicesSection.getByRole('heading', {
        name: 'Workflow & Business Automation'
      })
    ).toBeVisible();
    await expect(
      servicesSection.getByRole('heading', { name: 'Social & Messaging Bots' })
    ).toBeVisible();
    await expect(
      servicesSection.getByRole('heading', {
        name: 'AI Systems & Custom Web Apps'
      })
    ).toBeVisible();
  });

  test('pricing section renders starting rate baselines', async ({ page }) => {
    await page.goto('/#pricing');
    const pricingSection = page.locator('section#pricing');
    await expect(pricingSection).toBeVisible();

    await expect(pricingSection.getByText('$600')).toBeVisible();
    await expect(pricingSection.getByText('$900')).toBeVisible();
    await expect(pricingSection.getByText('$2,500')).toBeVisible();
  });

  test('featured blog section displays recent technical guides and link to archive', async ({
    page
  }) => {
    await page.goto('/#blogs');
    const blogsSection = page.locator('section#blogs');
    await expect(blogsSection).toBeVisible();

    const articles = blogsSection.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const exploreLink = blogsSection.getByRole('link', {
      name: EXPLORE_ALL_REGEX
    });
    await expect(exploreLink).toHaveAttribute('href', '/page/1');
  });

  test('pricing card CTA button links to inquiry with pre-selected subject anchor', async ({
    page
  }) => {
    await page.goto('/');
    const scopeWorkflowBtn = page
      .locator('section#pricing')
      .getByRole('link', { name: SCOPE_BUILD_REGEX })
      .first();

    await expect(scopeWorkflowBtn).toHaveAttribute(
      'href',
      CONTACT_SUBJECT_REGEX
    );
  });

  test('all homepage sections enforce uniform py-12 md:py-16 padding standard', async ({
    page
  }) => {
    await page.goto('/');
    const sectionIds = [
      'ecosystem',
      'architect',
      'services',
      'portfolio',
      'process',
      'pricing',
      'blogs',
      'contact',
      'faq'
    ];

    const heroSection = page.locator('section.overflow-hidden');
    await expect(heroSection).toHaveClass(PY_12_REGEX);
    await expect(heroSection).toHaveClass(MD_PY_16_REGEX);

    for (const id of sectionIds) {
      const sec = page.locator(`section#${id}`);
      await expect(sec).toHaveClass(PY_12_REGEX);
      await expect(sec).toHaveClass(MD_PY_16_REGEX);
    }
  });

  test('hero and section paragraphs enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroLeadContainer = page.locator('div.max-w-2xl.mx-auto.mb-8 > p');
    await expect(heroLeadContainer).toBeVisible();
    await expect(heroLeadContainer).toHaveClass(LEAD_PARAGRAPH_REGEX);

    const portfolioLead = page.locator(
      'section#portfolio div.max-w-3xl.mx-auto.text-center.mb-10 > p'
    );
    await expect(portfolioLead).toBeVisible();
    await expect(portfolioLead).toHaveClass(LEAD_PARAGRAPH_REGEX);

    const servicesLead = page.locator(
      'section#services div.text-center.max-w-2xl.mx-auto.mb-12 > p'
    );
    await expect(servicesLead).toBeVisible();
    await expect(servicesLead).toHaveClass(LEAD_PARAGRAPH_REGEX);
  });

  test('headings enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroHeading = page.locator('section.overflow-hidden h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toHaveClass(HERO_HEADING_REGEX);

    const servicesHeading = page.locator('section#services h2');
    await expect(servicesHeading).toBeVisible();
    await expect(servicesHeading).toHaveClass(SECTION_HEADING_REGEX);
  });

  test('subtitle tags enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroSubtitle = page.locator(
      'section.overflow-hidden span:has-text("Digital Realm Builder")'
    );
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toHaveClass(HERO_SUBTITLE_TAG_REGEX);

    const servicesSubtitle = page.locator(
      'section#services span:has-text("Core Capabilities")'
    );
    await expect(servicesSubtitle).toBeVisible();
    await expect(servicesSubtitle).toHaveClass(SERVICES_SUBTITLE_TAG_REGEX);
  });
});
