import { expect, test } from '@playwright/test';

const ABOUT_TITLE_REGEX = /About Chanveasna ENG/i;
const BOOK_CALL_REGEX = /Book Strategy Call/i;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;

test.describe('About Page Revamped Architecture', () => {
  test('about page loads with hero, portrait, and bio', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(ABOUT_TITLE_REGEX);

    const heading = page.getByRole('heading', { name: "Hi, I'm Veasna." });
    await expect(heading).toBeVisible();

    const profileImg = page.locator('img[alt*="Chanveasna Eng"]');
    await expect(profileImg).toBeVisible();

    const bookCallBtn = page.getByRole('link', { name: BOOK_CALL_REGEX });
    await expect(bookCallBtn).toBeVisible();
  });

  test('philosophy section displays core values manifesto', async ({
    page
  }) => {
    await page.goto('/about');
    const philosophySection = page.locator('section#philosophy');
    await expect(philosophySection).toBeVisible();

    await expect(
      philosophySection.getByRole('heading', {
        name: 'Autonomous Leverage (Zero Toil)'
      })
    ).toBeVisible();
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Deterministic Reliability & Failovers'
      })
    ).toBeVisible();
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Quality Consistency & Clean Architecture'
      })
    ).toBeVisible();
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Direct Partnership & Complete Ownership'
      })
    ).toBeVisible();
  });

  test('manifesto quote section renders standalone callout quote', async ({
    page
  }) => {
    await page.goto('/about');
    const quoteEl = page.locator('blockquote');
    await expect(quoteEl).toBeVisible();
    await expect(quoteEl).toContainText(
      'True digital architecture does not demand constant babysitting'
    );
    await expect(quoteEl).toContainText('Chanveasna ENG');
  });

  test('experience section displays competencies and journey', async ({
    page
  }) => {
    await page.goto('/about');
    const experienceSection = page.locator('section#experience');
    await expect(experienceSection).toBeVisible();

    await expect(
      experienceSection.getByRole('heading', {
        name: 'Workflow & Integration Engines'
      })
    ).toBeVisible();
    await expect(
      experienceSection.getByRole('heading', {
        name: 'Messaging & Bot Ecosystems'
      })
    ).toBeVisible();
    await expect(
      experienceSection.getByRole('heading', {
        name: 'Web Platforms & AI Engineering'
      })
    ).toBeVisible();
  });

  test('reused sections (process, portfolio, inquiry, faq) render on about page', async ({
    page
  }) => {
    await page.goto('/about');
    await expect(page.locator('section#process')).toBeVisible();
    await expect(page.locator('section#portfolio')).toBeVisible();
    await expect(page.locator('section#contact')).toBeVisible();
    await expect(page.locator('section#faq')).toBeVisible();
  });

  test('all about page sections enforce uniform py-12 md:py-16 padding standard', async ({
    page
  }) => {
    await page.goto('/about');
    const heroSec = page.locator('section.relative').first();
    await expect(heroSec).toHaveClass(PY_12_REGEX);
    await expect(heroSec).toHaveClass(MD_PY_16_REGEX);

    const sectionIds = [
      'philosophy',
      'experience',
      'process',
      'portfolio',
      'contact',
      'faq'
    ];
    for (const id of sectionIds) {
      const sec = page.locator(`section#${id}`);
      await expect(sec).toHaveClass(PY_12_REGEX);
      await expect(sec).toHaveClass(MD_PY_16_REGEX);
    }

    const quoteSec = page.locator('section:has(blockquote)');
    await expect(quoteSec).toHaveClass(PY_12_REGEX);
    await expect(quoteSec).toHaveClass(MD_PY_16_REGEX);
  });
});
