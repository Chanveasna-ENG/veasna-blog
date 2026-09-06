import { expect, test } from '@playwright/test';

const BLOG_PAGE_TITLE_REGEX = /Articles & Field Notes/i;
const SECTION_TITLE_REGEX = /Technical Guides & Articles/i;
const READ_ARTICLE_REGEX = /Read Article/i;
const POSTS_URL_REGEX = /\/posts\/.+/;
const MD_GRID_COLS_12_REGEX = /md:grid-cols-12/;
const PAGE_1_URL_REGEX = /\/page\/1/;
const SEARCH_SQUARESPACE_REGEX = /search=squarespace/;
const SEARCH_PARAM_REGEX = /search=/;

test.describe('Blog Archive Single-Column Horizontal Layout & Content Filtering', () => {
  test('renders single-column container with SectionHeader on /page/1', async ({
    page
  }) => {
    await page.goto('/page/1');
    await expect(page).toHaveTitle(BLOG_PAGE_TITLE_REGEX);

    const heading = page.getByRole('heading', { name: SECTION_TITLE_REGEX });
    await expect(heading).toBeVisible();

    const listContainer = page.locator('#blog-post-list');
    await expect(listContainer).toBeVisible();

    // Ensure legacy ProfileCard aside is NOT present
    const profileAside = page.locator('aside .sticky');
    await expect(profileAside).toHaveCount(0);
  });

  test('filters out project category cards from the blog archive', async ({
    page
  }) => {
    await page.goto('/page/1');
    const articles = page.locator('#blog-post-list article.medieval-frame');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      const categoryBadge = article.locator(
        'span.rounded-full, span:has-text("project"), span:has-text("PROJECT")'
      );
      // Ensure no badge has the text "project"
      const badgeText = (await categoryBadge.allInnerTexts())
        .join(' ')
        .toLowerCase();
      expect(badgeText).not.toContain('project');
    }
  });

  test('blog cards render responsive horizontal split with thumbnail left and details right', async ({
    page
  }) => {
    await page.goto('/page/1');
    const firstCard = page
      .locator('#blog-post-list article.medieval-frame')
      .first();
    await expect(firstCard).toBeVisible();

    const splitGrid = firstCard.locator('div.grid').first();
    await expect(splitGrid).toBeVisible();
    await expect(splitGrid).toHaveClass(MD_GRID_COLS_12_REGEX);

    const leftCol = splitGrid.locator('div.md\\:col-span-5');
    await expect(leftCol).toBeVisible();

    const imageLink = leftCol.locator('a.group\\/image');
    await expect(imageLink).toBeVisible();
    await expect(imageLink).toHaveAttribute('href', POSTS_URL_REGEX);

    const rightCol = splitGrid.locator('div.md\\:col-span-7');
    await expect(rightCol).toBeVisible();

    const readBtn = rightCol.getByRole('link', { name: READ_ARTICLE_REGEX });
    await expect(readBtn).toBeVisible();
    await expect(readBtn).toHaveAttribute('href', POSTS_URL_REGEX);
  });

  test('post detail page does not render cover image hero block in header', async ({
    page
  }) => {
    await page.goto('/posts/how-i-populate-2000-pages-on-squarespace');
    const postHeader = page.locator('main header').first();
    await expect(postHeader).toBeVisible();

    // Verify post title renders
    const title = postHeader.getByRole('heading', { level: 1 });
    await expect(title).toBeVisible();

    // Verify cover image container is not present in header (only decorative divider allowed)
    const coverImage = postHeader.locator('img:not([src*="divider"])');
    await expect(coverImage).toHaveCount(0);
  });

  test('footer Blog Archive link points to /page/1 and navigates cleanly', async ({
    page
  }) => {
    await page.goto('/');
    const footerArchiveLink = page
      .locator('footer')
      .getByRole('link', { name: 'Blog Archive' });
    await expect(footerArchiveLink).toHaveAttribute('href', '/page/1');

    await footerArchiveLink.click();
    await expect(page).toHaveURL(PAGE_1_URL_REGEX);
  });

  test('search input filters blog articles dynamically and tag filter bar is not rendered', async ({
    page
  }) => {
    await page.goto('/page/1');
    const searchInput = page.locator('#blog-search-input');
    await expect(searchInput).toBeVisible();

    const filterBar = page.locator('#blog-filter-bar');
    await expect(filterBar).toHaveCount(0);

    // Type query into search input
    await searchInput.fill('squarespace');
    await expect(page).toHaveURL(SEARCH_SQUARESPACE_REGEX);

    const visibleItems = page.locator('.blog-post-item:visible');
    const count = await visibleItems.count();
    expect(count).toBeGreaterThan(0);

    const clearBtn = page.locator('#blog-search-clear');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(page).not.toHaveURL(SEARCH_PARAM_REGEX);
  });

  test('/blog route redirects to /page/1', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL(PAGE_1_URL_REGEX);
  });
});
