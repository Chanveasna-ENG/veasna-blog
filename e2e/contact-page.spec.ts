import { expect, test } from '@playwright/test';

const BOOKING_TITLE_REGEX = /Book A Strategy Call/i;
const CALENDAR_SCHEDULE_REGEX =
  /calendar\.google\.com\/calendar\/appointments\/schedules/;
const MIX_BLEND_MULTIPLY_REGEX = /mix-blend-mode:\s*multiply/;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;

const BOOK_A_CALL_URL_REGEX = /.*\/book-a-call/;

test.describe('Book A Call Page & Navigation Architecture', () => {
  test('book-a-call page loads with hero, title, and embedded calendar', async ({
    page
  }) => {
    await page.goto('/book-a-call');
    await expect(page).toHaveTitle(BOOKING_TITLE_REGEX);

    const heading = page.getByRole('heading', {
      name: 'Book Your Strategy Call'
    });
    await expect(heading).toBeVisible();

    const subtitle = page.locator(
      'span:has-text("Direct Calendar Scheduling")'
    );
    await expect(subtitle).toBeVisible();

    const calendarContainer = page.locator('div.w-full.max-w-5xl.mt-6');
    await expect(calendarContainer).toBeVisible();

    const calendarIframe = page.locator(
      'iframe[title="Google Calendar Appointment Scheduling"]'
    );
    await expect(calendarIframe).toBeVisible();
    await expect(calendarIframe).toHaveAttribute(
      'src',
      CALENDAR_SCHEDULE_REGEX
    );
    await expect(calendarIframe).toHaveAttribute('height', '760');
    await expect(calendarIframe).toHaveAttribute(
      'style',
      MIX_BLEND_MULTIPLY_REGEX
    );

    const availabilityBadge = page.locator(
      'span:has-text("Active Availability:")'
    );
    await expect(availabilityBadge).not.toBeVisible();
  });

  test('what to expect section renders 3 consultation outcome cards', async ({
    page
  }) => {
    await page.goto('/book-a-call');
    const expectationsSection = page.locator('section#expectations');
    await expect(expectationsSection).toBeVisible();

    await expect(
      expectationsSection.getByRole('heading', {
        name: 'What To Expect On The Call'
      })
    ).toBeVisible();

    await expect(
      expectationsSection.getByRole('heading', {
        name: 'Personalized Strategy'
      })
    ).toBeVisible();
    await expect(
      expectationsSection.getByRole('heading', {
        name: 'Architectural Feasibility'
      })
    ).toBeVisible();
    await expect(
      expectationsSection.getByRole('heading', {
        name: 'Clear Next Steps'
      })
    ).toBeVisible();
  });

  test('reused faq and cta sections render on book-a-call page', async ({
    page
  }) => {
    await page.goto('/book-a-call');
    await expect(page.locator('section#faq')).toBeVisible();
    await expect(page.locator('section#cta')).toBeVisible();
  });

  test('all book-a-call page sections enforce uniform py-12 md:py-16 padding standard', async ({
    page
  }) => {
    await page.goto('/book-a-call');
    const heroSec = page.locator('section.relative').first();
    await expect(heroSec).toHaveClass(PY_12_REGEX);
    await expect(heroSec).toHaveClass(MD_PY_16_REGEX);

    const expectationsSec = page.locator('section#expectations');
    await expect(expectationsSec).toHaveClass(PY_12_REGEX);
    await expect(expectationsSec).toHaveClass(MD_PY_16_REGEX);

    const faqSec = page.locator('section#faq');
    await expect(faqSec).toHaveClass(PY_12_REGEX);
    await expect(faqSec).toHaveClass(MD_PY_16_REGEX);

    const ctaSec = page.locator('section#cta');
    await expect(ctaSec).toHaveClass(PY_12_REGEX);
    await expect(ctaSec).toHaveClass(MD_PY_16_REGEX);
  });

  test('legacy /contact route redirects to /book-a-call', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(BOOK_A_CALL_URL_REGEX);
  });

  test('header navigation and footer contact links point to /#contact and button to /book-a-call', async ({
    page
  }) => {
    await page.goto('/');

    const navContact = page.locator('header nav a[href="/#contact"]');
    await expect(navContact).toBeVisible();
    await expect(navContact).toHaveText('Contact');

    const headerCta = page.locator('header a[href="/book-a-call"]');
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toContainText('Book A Call');

    const footerContact = page.locator('footer a[href="/#contact"]');
    await expect(footerContact).toBeVisible();
    await expect(footerContact).toHaveText('Contact');
  });
});
