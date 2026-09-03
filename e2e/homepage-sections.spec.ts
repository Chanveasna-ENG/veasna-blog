import { expect, test } from '@playwright/test';

const EXPLORE_ALL_REGEX = /Explore All Articles/i;
const SCOPE_BUILD_REGEX = /Scope This Build/i;
const CONTACT_SUBJECT_REGEX = /#contact\?subject=/;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;

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
});
