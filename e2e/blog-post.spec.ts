import { expect, test } from '@playwright/test';

const POST_URL = '/posts/how-i-populate-2000-pages-on-squarespace';
const CODE_POST_URL = '/posts/oracle-free-instance';
const PROJECT_POST_URL = '/posts/resilient-cloud-portal';
const TITLE_REGEX =
  /How I Populated 2000 Blog Posts on Squarespace \| Chanveasna ENG/i;
const BACK_TO_ARTICLES_REGEX = /Back to Articles/i;
const BACK_TO_PORTFOLIO_REGEX = /Back to Portfolio/i;
const PAGE_1_REGEX = /\/page\/1/;
const PORTFOLIO_REGEX = /\/portfolio/;
const BOOK_CALL_URL_REGEX = /\/book-a-call/;
const PROGRESS_WIDTH_REGEX = /width:\s*([1-9]\d*(\.\d+)?%|100%)/;
const PARCHMENT_CODE_THEME_REGEX = /github-light/;
const BOOK_CONSULTATION_REGEX = /Book Consultation/i;
const POSTS_LINK_REGEX = /\/posts\/.+/;
const MIN_READ_REGEX = /\d+\s+min\s+read/i;
const PROFILE_IMG_SRC_REGEX = /\/images\/profile\.jpg/;
const ARTICLE_WORD_REGEX = /Article/i;
const PROJECT_WORD_REGEX = /Project/i;
const HIRE_US_REGEX = /Hire Us/i;
const ROUNDED_FULL_REGEX = /rounded-full/;
const BORDER_B_REGEX = /border-b/;
const BORDER_T_REGEX = /border-t/;
const PB_6_REGEX = /pb-6/;
const ENGRAVED_SHADOW_REGEX = /engraved-shadow/;

test.describe('Single Blog Post Layout & Reading Experience', () => {
  test('renders branded title, breadcrumb to /page/1, reading time, and metadata', async ({
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

    // Metadata items: date and precomputed reading time
    const metadataArea = page.locator('header time');
    await expect(metadataArea).toBeVisible();

    const readingTime = page.locator('header span:has-text("min read")');
    await expect(readingTime).toBeVisible();
    await expect(readingTime).toHaveText(MIN_READ_REGEX);
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

  test('renders desktop sticky sidebar Table of Contents with valid anchor links', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(POST_URL);

    // Sidebar aside must have sticky top positioning classes
    const stickyAside = page.locator('aside.sticky.top-6');
    await expect(stickyAside).toBeVisible();

    const desktopToc = page.locator('nav[aria-label="Table of Contents"]');
    await expect(desktopToc).toBeVisible();

    // Verify TOC scroll container has pb-6 bottom padding
    const tocList = desktopToc.locator('ul.overflow-y-auto');
    await expect(tocList).toHaveClass(PB_6_REGEX);

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

  test('renders code blocks with github-light parchment theme, transparent code lines, and interactive copy button', async ({
    page,
    context
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(CODE_POST_URL);

    const preBlock = page.locator('article.blog-article-body pre').first();
    await expect(preBlock).toBeVisible();

    // Verify pre block has github-light theme
    await expect(preBlock).toHaveClass(PARCHMENT_CODE_THEME_REGEX);

    // Verify code lines do not have patchy background
    const codeTag = preBlock.locator('code');
    await expect(codeTag).toBeAttached();
    await expect(codeTag).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

    // Verify copy button presence
    const copyButton = preBlock.locator('button.copy-code-btn');
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toHaveText('Copy');

    // Click copy button and assert feedback state
    await copyButton.click();
    await expect(copyButton).toHaveText('Copied!');
  });

  test('centers markdown images in blog article body', async ({ page }) => {
    await page.goto(CODE_POST_URL);

    const firstImage = page.locator('article.blog-article-body img').first();
    await expect(firstImage).toBeVisible();

    // Check display and auto margins via computed style
    const isCentered = await firstImage.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display === 'block';
    });
    expect(isCentered).toBe(true);
  });

  test('renders AuthorProfileCard with profile photo, atomic structure, and PrimaryButton', async ({
    page
  }) => {
    await page.goto(POST_URL);

    // Profile photo image (sharp rectangular headshot frame)
    const avatar = page
      .locator(
        'article.medieval-frame img[alt*="Headshot"], div.grid img[alt*="Headshot"], article.medieval-frame img[alt*="Avatar"], div.grid img[alt*="Avatar"]'
      )
      .first();
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('src', PROFILE_IMG_SRC_REGEX);
    await expect(avatar).not.toHaveClass(ROUNDED_FULL_REGEX);

    // Author card heading
    const authorHeading = page.getByRole('heading', {
      name: 'Chanveasna Eng',
      exact: true
    });
    await expect(authorHeading).toBeVisible();

    // Updated SubtitleTag with architect role
    const roleTag = page.getByText(
      'Digital Systems Architect & Automation Specialist'
    );
    await expect(roleTag).toBeVisible();
    await expect(page.getByText('ABOUT THE ARCHITECT')).toHaveCount(0);

    // Primary button consultation CTA link
    const consultationBtn = page.getByRole('link', {
      name: BOOK_CONSULTATION_REGEX
    });
    await expect(consultationBtn).toBeVisible();
    await expect(consultationBtn).toHaveAttribute('href', BOOK_CALL_URL_REGEX);
  });

  test('renders SimilarBlogList with strictly matched category recommendations', async ({
    page
  }) => {
    await page.goto(POST_URL);

    const similarSection = page.locator(
      'section[aria-labelledby="similar-posts-heading"]'
    );
    await expect(similarSection).toBeVisible();
    await expect(similarSection).not.toHaveClass(BORDER_T_REGEX);

    const relatedCards = similarSection.locator('article.medieval-frame');
    const cardCount = await relatedCards.count();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(3);

    // Verify all recommended cards are 'BLOG' category, none are 'PROJECT'
    for (let i = 0; i < cardCount; i++) {
      const card = relatedCards.nth(i);
      const categoryText = await card.locator('.font-mono').innerText();
      expect(categoryText.toUpperCase()).toContain('BLOG');
      expect(categoryText.toUpperCase()).not.toContain('PROJECT');

      const cardLink = card.locator('a').first();
      const href = await cardLink.getAttribute('href');
      expect(href).toMatch(POSTS_LINK_REGEX);
      expect(href).not.toBe(POST_URL);
    }
  });

  test('renders PostNavigation adjacent post switch with category matching', async ({
    page
  }) => {
    await page.goto(POST_URL);

    const navSwitch = page.locator(
      'nav[aria-label="Adjacent Articles Navigation"]'
    );
    await expect(navSwitch).toBeVisible();
    await expect(navSwitch).not.toHaveClass(BORDER_T_REGEX);

    // Either previous or next exists
    const navLinks = navSwitch.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const text = await link.innerText();
      expect(text).toMatch(ARTICLE_WORD_REGEX);
      expect(text).not.toMatch(PROJECT_WORD_REGEX);
      await expect(link).toHaveAttribute('href', POSTS_LINK_REGEX);
    }
  });

  test('breadcrumb on project post navigates back to /portfolio', async ({
    page
  }) => {
    await page.goto(PROJECT_POST_URL);

    const breadcrumb = page.getByRole('link', {
      name: BACK_TO_PORTFOLIO_REGEX
    });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toHaveAttribute('href', PORTFOLIO_REGEX);

    await breadcrumb.click();
    await expect(page).toHaveURL(PORTFOLIO_REGEX);
  });

  test('renders SidebarHireCard under TableOfContent in desktop sidebar', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(POST_URL);

    const stickyAside = page.locator('aside.sticky.top-6');
    await expect(stickyAside).toBeVisible();

    // Verify 'HAVE A CHAT' subtitle was removed
    await expect(stickyAside.getByText('HAVE A CHAT')).toHaveCount(0);

    // Verify TOC is inside aside
    const desktopToc = stickyAside.locator(
      'nav[aria-label="Table of Contents"]'
    );
    await expect(desktopToc).toBeVisible();

    // Verify SidebarHireCard is inside aside
    const hireHeading = stickyAside.getByRole('heading', {
      name: 'Start Your Project',
      exact: true
    });
    await expect(hireHeading).toBeVisible();

    const hireBtn = stickyAside.getByRole('link', {
      name: HIRE_US_REGEX
    });
    await expect(hireBtn).toBeVisible();
    await expect(hireBtn).toHaveAttribute('href', BOOK_CALL_URL_REGEX);

    // Verify sharp rectangular headshot (no rounded-full)
    const hireImg = stickyAside.locator('img[alt="Chanveasna Eng"]');
    await expect(hireImg).toBeVisible();
    await expect(hireImg).not.toHaveClass(ROUNDED_FULL_REGEX);
  });

  test('renders floating booking widget across pages with sharp medieval geometry, but suppresses on /book-a-call', async ({
    page
  }) => {
    // 1. Visible on blog post with sharp medieval styling
    await page.goto(POST_URL);
    const postWidget = page.locator('#floating-booking-widget');
    await expect(postWidget).toBeVisible();
    await expect(postWidget).toHaveAttribute('href', BOOK_CALL_URL_REGEX);
    await expect(postWidget).toContainText('Book A Call');
    await expect(postWidget).toContainText('Start Today');
    await expect(postWidget).not.toHaveClass(ROUNDED_FULL_REGEX);

    // 2. Visible on home page
    await page.goto('/');
    const homeWidget = page.locator('#floating-booking-widget');
    await expect(homeWidget).toBeVisible();
    await expect(homeWidget).not.toHaveClass(ROUNDED_FULL_REGEX);

    // 3. Suppressed on /book-a-call
    await page.goto('/book-a-call');
    const bookingWidget = page.locator('#floating-booking-widget');
    await expect(bookingWidget).toHaveCount(0);
  });

  test('renders canonical SVG dividers and zero avatar shadow on single post page', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(POST_URL);

    // 1. PostHeader diamond divider (no plain border-b)
    const header = page.locator('header.mb-10');
    await expect(header).not.toHaveClass(BORDER_B_REGEX);
    const headerDiamond = header.locator('img[src*="divider-diamond.svg"]');
    await expect(headerDiamond).toBeVisible();

    // 2. Section boundary diamond divider above Related Analyses
    const contentFooter = page.locator('div.mt-14');
    const footerDiamond = contentFooter.locator(
      'img[src*="divider-diamond.svg"]'
    );
    await expect(footerDiamond).toBeVisible();

    // 4. AuthorProfileCard and SidebarHireCard headshot containers have zero shadow
    const authorImgBox = page.locator('img[alt*="Headshot"]').locator('..');
    await expect(authorImgBox).not.toHaveClass(ENGRAVED_SHADOW_REGEX);

    const hireImgBox = page.locator('img[alt="Chanveasna Eng"]').locator('..');
    await expect(hireImgBox).not.toHaveClass(ENGRAVED_SHADOW_REGEX);
  });
});
