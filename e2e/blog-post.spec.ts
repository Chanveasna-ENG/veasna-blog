import { expect, test } from '@playwright/test';

const POST_URL = '/posts/how-i-populate-2000-pages-on-squarespace';
const CODE_POST_URL = '/posts/oracle-free-instance';
const TITLE_REGEX =
  /How I Populated 2000 Blog Posts on Squarespace \| Chanveasna ENG/i;
const BACK_TO_ARTICLES_REGEX = /Back to Articles/i;
const PAGE_1_REGEX = /\/page\/1/;
const BOOK_CALL_URL_REGEX = /\/book-a-call/;
const PROGRESS_WIDTH_REGEX = /width:\s*([1-9]\d*(\.\d+)?%|100%)/;
const DARK_PRE_BG_REGEX = /bg-\[#1a1714\]/;
const BOOK_CONSULTATION_REGEX = /Book Consultation/i;
const POSTS_LINK_REGEX = /\/posts\/.+/;

test.describe('Single Blog Post Layout & Reading Experience', () => {
  test('renders branded title, breadcrumb to /page/1, and post metadata', async ({
    page
  }) => {
    await page.goto(POST_URL);
    await expect(page).toHaveTitle(TITLE_REGEX);

    // Breadcrumb link
    const breadcrumb = page.getByRole('link', { name: BACK_TO_ARTICLES_REGEX });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toHaveAttribute('href', PAGE_1_REGEX);

    // Post header title (H1)
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(
      'How I Populated 2000 Blog Posts on Squarespace'
    );

    // Metadata items
    const metadataArea = page.locator('header time');
    await expect(metadataArea).toBeVisible();
  });

  test('breadcrumb navigates cleanly back to blog archive /page/1', async ({
    page
  }) => {
    await page.goto(POST_URL);
    const breadcrumb = page.getByRole('link', { name: BACK_TO_ARTICLES_REGEX });
    await breadcrumb.click();
    await expect(page).toHaveURL(PAGE_1_REGEX);
  });

  test('does not contain legacy v1 dark-mode classes in post body', async ({
    page
  }) => {
    await page.goto(POST_URL);
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify absence of legacy classes
    const proseInvert = page.locator('.prose-invert');
    await expect(proseInvert).toHaveCount(0);

    const darkBg = page.locator('.bg-darkBg');
    await expect(darkBg).toHaveCount(0);

    const gray800 = page.locator('.bg-gray-800');
    await expect(gray800).toHaveCount(0);
  });

  test('renders pinned top reading progress bar that advances on scroll', async ({
    page
  }) => {
    await page.goto(POST_URL);

    const progressBar = page.locator('#reading-progress-bar');
    await expect(progressBar).toBeAttached();

    // Scroll down 800px
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(150);

    const style = await progressBar.getAttribute('style');
    expect(style).toMatch(PROGRESS_WIDTH_REGEX);
  });

  test('renders desktop sticky Table of Contents with valid heading anchor links', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(POST_URL);

    const desktopToc = page.locator('nav[aria-label="Table of Contents"]');
    await expect(desktopToc).toBeVisible();

    const tocLinks = desktopToc.locator('a.toc-link');
    const linkCount = await tocLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Verify first link points to an actual ID in the article body
    const firstHref = await tocLinks.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
    const targetId = firstHref?.replace('#', '');
    const headingTarget = page.locator(
      `article.blog-article-body #${targetId}`
    );
    await expect(headingTarget).toBeAttached();
  });

  test('renders mobile collapsible Table of Contents accordion on narrow viewport', async ({
    page
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(POST_URL);

    // Desktop TOC should be hidden on mobile
    const desktopToc = page.locator('nav[aria-label="Table of Contents"]');
    await expect(desktopToc).toBeHidden();

    // Mobile collapsible details element should be visible
    const mobileToc = page.locator('details');
    await expect(mobileToc).toBeVisible();

    const summary = mobileToc.locator('summary');
    await expect(summary).toContainText('Table of Contents');

    // Expand mobile TOC
    await summary.click();
    const mobileLinks = mobileToc.locator('a.toc-link');
    const count = await mobileLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('renders code blocks with dark charcoal theme and interactive copy button', async ({
    page,
    context
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(CODE_POST_URL);

    const preBlock = page.locator('article.blog-article-body pre').first();
    await expect(preBlock).toBeVisible();

    // Verify pre block has dark charcoal background class
    await expect(preBlock).toHaveClass(DARK_PRE_BG_REGEX);

    // Verify copy button presence
    const copyButton = preBlock.locator('button.copy-code-btn');
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toHaveText('Copy');

    // Click copy button and assert feedback state
    await copyButton.click();
    await expect(copyButton).toHaveText('Copied!');
  });

  test('renders AuthorProfileCard with avatar, bio, and Book Consultation CTA', async ({
    page
  }) => {
    await page.goto(POST_URL);

    // Author card heading
    const authorHeading = page.getByRole('heading', {
      name: 'Chanveasna Eng',
      exact: true
    });
    await expect(authorHeading).toBeVisible();

    // Book consultation CTA link
    const consultationBtn = page.getByRole('link', {
      name: BOOK_CONSULTATION_REGEX
    });
    await expect(consultationBtn).toBeVisible();
    await expect(consultationBtn).toHaveAttribute('href', BOOK_CALL_URL_REGEX);
  });

  test('renders SimilarBlogList with related recommendation cards', async ({
    page
  }) => {
    await page.goto(POST_URL);

    const similarSection = page.locator(
      'section[aria-labelledby="similar-posts-heading"]'
    );
    await expect(similarSection).toBeVisible();

    const relatedCards = similarSection.locator('article.medieval-frame');
    const cardCount = await relatedCards.count();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(3);

    // Verify cards link to other posts and not the current post
    for (let i = 0; i < cardCount; i++) {
      const cardLink = relatedCards.nth(i).locator('a').first();
      const href = await cardLink.getAttribute('href');
      expect(href).toMatch(POSTS_LINK_REGEX);
      expect(href).not.toBe(POST_URL);
    }
  });
});
