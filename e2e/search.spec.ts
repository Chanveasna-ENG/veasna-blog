import { expect, test } from '@playwright/test';

const SEARCH_TITLE_REGEX = /Search Results/i;

test.describe('Search functionality', () => {
  test('search page renders feed container', async ({ page }) => {
    await page.goto('/search?q=astro');
    await expect(page).toHaveTitle(SEARCH_TITLE_REGEX);
    const heading = page.locator('h2', {
      hasText: 'Here is what you are looking for'
    });
    await expect(heading).toBeVisible();
  });
});
