import { expect, test } from '@playwright/test';

const ABOUT_TITLE_REGEX = /About Chanveasna ENG/i;
const BOOK_CALL_REGEX = /Book Strategy Call/i;

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
});
