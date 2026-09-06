import { expect, test } from '@playwright/test';

const PORTFOLIO_TITLE_REGEX = /Systems Portfolio/i;
const PORTFOLIO_PAGE_TITLE_REGEX = /Portfolio/i;
const READ_CASE_STUDY_REGEX = /Read Case Study/i;
const POSTS_URL_REGEX = /\/posts\/.+/;
const FLEX_COL_REGEX = /flex-col/;
const GAP_8_REGEX = /gap-8/;
const MD_GRID_COLS_12_REGEX = /md:grid-cols-12/;
const ALL_TAG_REGEX = /all/i;
const RESET_PORTFOLIO_URL_REGEX = /\/portfolio(?!\?tag=)/;
const BG_CRIMSON_REGEX = /bg-crimson/;
const BG_INK_REGEX = /bg-ink/;
const MB_DIGIT_REGEX = /mb-\d+/;

test.describe('Systems Portfolio Single-Column Horizontal Cards Architecture', () => {
  test('renders single-column vertical stack container on portfolio page', async ({
    page
  }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveTitle(PORTFOLIO_PAGE_TITLE_REGEX);

    const heading = page.getByRole('heading', { name: PORTFOLIO_TITLE_REGEX });
    await expect(heading).toBeVisible();

    const listContainer = page.locator('#portfolio-project-list');
    await expect(listContainer).toBeVisible();
    await expect(listContainer).toHaveClass(FLEX_COL_REGEX);
    await expect(listContainer).toHaveClass(GAP_8_REGEX);
  });

  test('portfolio cards render responsive 12-column horizontal split with image left and content right', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const firstCard = page.locator('article.medieval-frame').first();
    await expect(firstCard).toBeVisible();

    const splitGrid = firstCard.locator('div.grid').first();
    await expect(splitGrid).toBeVisible();
    await expect(splitGrid).toHaveClass(MD_GRID_COLS_12_REGEX);

    const leftCol = splitGrid.locator('div.md\\:col-span-5');
    await expect(leftCol).toBeVisible();

    const rightCol = splitGrid.locator('div.md\\:col-span-7');
    await expect(rightCol).toBeVisible();
  });

  test('portfolio cards provide clickable preview image links to case studies', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const imageLinks = page.locator('article.medieval-frame a.group\\/image');
    const count = await imageLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = imageLinks.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', POSTS_URL_REGEX);
    }
  });

  test('portfolio cards provide clickable title links to case studies', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const titleLinks = page.locator('article.medieval-frame h2 a');
    const count = await titleLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = titleLinks.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', POSTS_URL_REGEX);
    }
  });

  test('portfolio cards render inline footer row with tracking label and action button in right column', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const firstCard = page.locator('article.medieval-frame').first();
    await expect(firstCard).toBeVisible();

    const rightCol = firstCard.locator('div.md\\:col-span-7');
    const trackingLabel = rightCol.locator(
      'span.text-bronze:has-text("Case Study")'
    );
    await expect(trackingLabel).toBeVisible();

    const readCaseStudyBtn = rightCol.getByRole('link', {
      name: READ_CASE_STUDY_REGEX
    });
    await expect(readCaseStudyBtn).toBeVisible();
    await expect(readCaseStudyBtn).toHaveAttribute('href', POSTS_URL_REGEX);
  });

  test('tag filter bar renders dynamic buttons with All active by default and filters on click', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const filterBar = page.locator('#portfolio-filter-bar');
    await expect(filterBar).toBeVisible();

    const filterButtons = filterBar.locator('button[data-filter-tag]');
    const btnCount = await filterButtons.count();
    expect(btnCount).toBeGreaterThan(1);

    const allBtn = filterButtons.first();
    await expect(allBtn).toContainText(ALL_TAG_REGEX);
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(allBtn).toHaveClass(BG_CRIMSON_REGEX);
    await expect(allBtn).not.toHaveClass(BG_INK_REGEX);

    const totalItems = await page.locator('.portfolio-project-item').count();
    expect(totalItems).toBeGreaterThan(0);

    // Click the second filter button (first specific tag)
    const specificBtn = filterButtons.nth(1);
    const tagSlug = await specificBtn.getAttribute('data-filter-tag');
    expect(tagSlug).toBeTruthy();

    await specificBtn.click();
    await expect(page).toHaveURL(new RegExp(`\\?tag=${tagSlug}`));
    await expect(specificBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(specificBtn).toHaveClass(BG_CRIMSON_REGEX);
    await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(allBtn).not.toHaveClass(BG_CRIMSON_REGEX);

    // Click 'All' to reset
    await allBtn.click();
    await expect(page).toHaveURL(RESET_PORTFOLIO_URL_REGEX);
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(allBtn).toHaveClass(BG_CRIMSON_REGEX);
    const visibleAfterReset = page.locator('.portfolio-project-item:visible');
    await expect(visibleAfterReset).toHaveCount(totalItems);
  });

  test('deep linking to /portfolio with ?tag= parameter filters cards on load', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const filterButtons = page.locator(
      '#portfolio-filter-bar button[data-filter-tag]'
    );
    const secondBtn = filterButtons.nth(1);
    const tagSlug = await secondBtn.getAttribute('data-filter-tag');

    if (tagSlug) {
      await page.goto(`/portfolio?tag=${tagSlug}`);
      const activeBtn = page.locator(
        `#portfolio-filter-bar button[data-filter-tag="${tagSlug}"]`
      );
      await expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('search input is not present on portfolio page, keeping clean tag filter interface', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const searchInput = page.locator('#portfolio-search-input');
    await expect(searchInput).toHaveCount(0);
  });

  test('bottom CTA banner description enforces mb-0 and spacing="none"', async ({
    page
  }) => {
    await page.goto('/portfolio');
    const bannerParagraph = page.locator('div.mt-20 p');
    await expect(bannerParagraph).toBeVisible();
    await expect(bannerParagraph).not.toHaveClass(MB_DIGIT_REGEX);
  });
});
