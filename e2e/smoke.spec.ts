import { expect, test } from '@playwright/test';

const HOME_TITLE_REGEX = /Chanveasna ENG/i;
const ABOUT_TITLE_REGEX = /About/i;
const PORTFOLIO_TITLE_REGEX = /Portfolio/i;

test.describe('Blog smoke tests', () => {
  test('home page loads and renders header and title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(HOME_TITLE_REGEX);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('about page loads successfully', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(ABOUT_TITLE_REGEX);
  });

  test('portfolio page loads successfully', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveTitle(PORTFOLIO_TITLE_REGEX);
  });

  test('404 page renders for invalid routes', async ({ page }) => {
    await page.goto('/404');
    const heading = page.getByRole('heading', { name: '404' });
    await expect(heading).toBeVisible();
  });
});
