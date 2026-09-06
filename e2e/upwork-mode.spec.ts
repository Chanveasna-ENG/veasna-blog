import { expect, test } from '@playwright/test';

const UPWORK_DOMAIN_REGEX = /upwork\.com/;
const HIRE_ON_UPWORK_REGEX = /Hire on Upwork/i;
const UPWORK_PARAM_REGEX = /\?upwork=true/;
const CUSTOM_SOLUTION_HEADING_REGEX =
  /Have a Project in Mind\?|Need a Custom Solution Engineered\?/i;

test.describe('Upwork Compliance Mode (?upwork=true)', () => {
  test.beforeEach(async ({ context }) => {
    // Intercept external Upwork profile navigations to run safely offline
    await context.route('https://upwork.com/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Upwork Profile Mock</body></html>'
      })
    );
  });

  test('activates mode on ?upwork=true, hides contact section, rewrites CTAs, and sets 24h expiry', async ({
    page
  }) => {
    await page.goto('/?upwork=true');

    // 1. Root attribute verification
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-upwork-mode', 'true');

    // 2. Storage verification (timestamp ~ 24h from now)
    const storedExpiry = await page.evaluate(() =>
      localStorage.getItem('upwork_mode_expiry')
    );
    expect(storedExpiry).not.toBeNull();
    const expiryNum = Number.parseInt(storedExpiry || '0', 10);
    const now = Date.now();
    const diffHours = (expiryNum - now) / (1000 * 60 * 60);
    expect(diffHours).toBeGreaterThan(23.9);
    expect(diffHours).toBeLessThanOrEqual(24.1);

    // 3. Off-platform intake section must be hidden
    const inquirySection = page.locator('section#contact');
    await expect(inquirySection).toBeHidden();

    // 4. Header Nav Link & Header CTA button both rewritten to Upwork profile
    const headerNavLink = page.locator('header nav a[href*="upwork.com"]');
    await expect(headerNavLink).toBeVisible();
    await expect(headerNavLink).toHaveAttribute('target', '_blank');
    await expect(headerNavLink).toContainText(HIRE_ON_UPWORK_REGEX);

    const headerCta = page.locator(
      'header .flex.items-center > a[href*="upwork.com"]'
    );
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toHaveAttribute('target', '_blank');
    await expect(headerCta).toContainText(HIRE_ON_UPWORK_REGEX);

    // 5. Floating booking widget rewritten
    const floatingWidget = page.locator('#floating-booking-widget');
    await expect(floatingWidget).toBeVisible();
    await expect(floatingWidget).toHaveAttribute('href', UPWORK_DOMAIN_REGEX);
    await expect(floatingWidget).toHaveAttribute('target', '_blank');
    await expect(floatingWidget).toContainText(HIRE_ON_UPWORK_REGEX);

    // 6. Internal nav link propagation
    const portfolioLink = page.locator('nav a[href*="/portfolio"]');
    await expect(portfolioLink).toHaveAttribute('href', UPWORK_PARAM_REGEX);
  });

  test('persists mode without query param when unexpired timestamp is stored in localStorage', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'upwork_mode_expiry',
        String(Date.now() + 12 * 60 * 60 * 1000)
      );
    });

    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute(
      'data-upwork-mode',
      'true'
    );
    await expect(page.locator('section#contact')).toBeHidden();

    const headerCta = page.locator(
      'header .flex.items-center > a[href*="upwork.com"]'
    );
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toContainText(HIRE_ON_UPWORK_REGEX);
  });

  test('deactivates mode and clears localStorage when stored timestamp is expired', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'upwork_mode_expiry',
        String(Date.now() - 10000) // 10 seconds expired
      );
    });

    await page.goto('/');

    await expect(page.locator('html')).not.toHaveAttribute(
      'data-upwork-mode',
      'true'
    );
    await expect(page.locator('section#contact')).toBeVisible();

    const storedExpiry = await page.evaluate(() =>
      localStorage.getItem('upwork_mode_expiry')
    );
    expect(storedExpiry).toBeNull();
  });

  test('intercepts direct navigation to /contact when active and redirects to Upwork', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('upwork_mode_expiry', String(Date.now() + 3600000));
    });

    await page.goto('/contact');
    await expect(page).toHaveURL(UPWORK_DOMAIN_REGEX);
  });

  test('intercepts direct navigation to /book-a-call when active and redirects to Upwork', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('upwork_mode_expiry', String(Date.now() + 3600000));
    });

    await page.goto('/book-a-call');
    await expect(page).toHaveURL(UPWORK_DOMAIN_REGEX);
  });

  test('suppresses social links strips and rewrites consultation button in author card and architect section', async ({
    page
  }) => {
    // 1. Architect section on home page
    await page.goto('/?upwork=true');
    const architectSocials = page.locator(
      'section#architect [data-upwork-hide]'
    );
    await expect(architectSocials).toBeHidden();

    const architectCta = page
      .locator('section#architect')
      .getByRole('link', { name: HIRE_ON_UPWORK_REGEX });
    await expect(architectCta).toBeVisible();
    await expect(architectCta).toHaveAttribute('target', '_blank');

    // 2. Author card on single blog post
    await page.goto('/posts/autonomous-crm-sync?upwork=true');
    const authorCardSocials = page.locator(
      '.author-profile-card [data-upwork-hide]'
    );
    await expect(authorCardSocials).toBeHidden();

    const authorCta = page.locator(
      '.author-profile-card .flex-shrink-0 a[href*="upwork.com"]'
    );
    await expect(authorCta).toBeVisible();
    await expect(authorCta).toContainText(HIRE_ON_UPWORK_REGEX);
    await expect(authorCta).toHaveAttribute('target', '_blank');
  });

  test('rewrites mailto: action buttons on portfolio and CTA sections to Upwork profile', async ({
    page
  }) => {
    // 1. Portfolio bottom banner
    await page.goto('/portfolio?upwork=true');
    const portfolioBannerHeading = page.getByRole('heading', {
      name: CUSTOM_SOLUTION_HEADING_REGEX
    });
    await expect(portfolioBannerHeading).toBeVisible();

    const portfolioCta = page.locator('main a[href*="upwork.com"]');
    await expect(portfolioCta).toBeVisible();
    await expect(portfolioCta).toHaveAttribute('target', '_blank');
    await expect(portfolioCta).toContainText(HIRE_ON_UPWORK_REGEX);

    // 2. Homepage CTA section with mailto button
    await page.goto('/?upwork=true');
    const ctaSectionButton = page.locator('section#cta a[href*="upwork.com"]');
    await expect(ctaSectionButton).toBeVisible();
    await expect(ctaSectionButton).toHaveAttribute('target', '_blank');
    await expect(ctaSectionButton).toContainText(HIRE_ON_UPWORK_REGEX);
  });
});
