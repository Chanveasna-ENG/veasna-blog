import { expect, test } from '@playwright/test';

const ABOUT_TITLE_REGEX = /About Chanveasna ENG/i;
const BOOK_CALL_REGEX = /Book Strategy Call/i;
const VIEW_PROJECTS_REGEX = /View Recent Projects/i;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;
const W_11_REGEX = /w-11/;
const H_11_REGEX = /h-11/;

test.describe('About Page Revamped Architecture', () => {
  test('about page loads with hero, portrait, and bio', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(ABOUT_TITLE_REGEX);

    const heading = page.getByRole('heading', { name: "Hi, I'm Veasna." });
    await expect(heading).toBeVisible();

    const subtitle = page.locator('span:has-text("Digital Systems Architect")');
    await expect(subtitle).toBeVisible();

    const profileImg = page.locator('img[alt*="Chanveasna Eng"]');
    await expect(profileImg).toBeVisible();

    const heroSection = page.locator('section.relative').first();
    const socialGroup = heroSection.locator('div[data-upwork-hide="true"]');
    await expect(socialGroup).toBeVisible();

    const socialLinks = socialGroup.locator('a[title]');
    await expect(socialLinks).toHaveCount(4);
    await expect(socialLinks.first()).toHaveClass(W_11_REGEX);
    await expect(socialLinks.first()).toHaveClass(H_11_REGEX);

    const actionRow = heroSection.locator('div.pt-3.flex');
    await expect(actionRow).toBeVisible();

    const bookCallBtn = actionRow.getByRole('link', { name: BOOK_CALL_REGEX });
    await expect(bookCallBtn).toBeVisible();
    await expect(bookCallBtn).toHaveAttribute('href', '/book-a-call');

    const viewWorkBtn = actionRow.getByRole('link', {
      name: VIEW_PROJECTS_REGEX
    });
    await expect(viewWorkBtn).toBeVisible();
    await expect(viewWorkBtn).toHaveAttribute('href', '#portfolio');

    const connectFollowLabel = page.locator(
      'span:has-text("Connect & Follow:")'
    );
    await expect(connectFollowLabel).not.toBeVisible();
  });

  test('philosophy section displays core values manifesto', async ({
    page
  }) => {
    await page.goto('/about');
    const philosophySection = page.locator('section#philosophy');
    await expect(philosophySection).toBeVisible();

    await expect(
      philosophySection.getByRole('heading', {
        name: 'Automate Repetitive Work'
      })
    ).toBeVisible();
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Build for Reliability'
      })
    ).toBeVisible();
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Direct Access & Full Ownership'
      })
    ).toBeVisible();

    // Verify removed pillar is not present
    await expect(
      philosophySection.getByRole('heading', {
        name: 'Quality Consistency & Clean Architecture'
      })
    ).not.toBeVisible();
  });

  test('manifesto quote section renders standalone callout quote', async ({
    page
  }) => {
    await page.goto('/about');
    const quoteEl = page.locator('blockquote');
    await expect(quoteEl).toBeVisible();
    await expect(quoteEl).toContainText(
      "A well-built system doesn't need daily babysitting"
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
        name: 'Web Platforms & Custom Tools'
      })
    ).toBeVisible();

    const experienceIcons = experienceSection.locator(
      'img[src*="/svg/sketch"]'
    );
    await expect(experienceIcons).toHaveCount(0);
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

  test('about hero action buttons stack vertically on mobile and render side-by-side on desktop', async ({
    page
  }) => {
    // 1. Mobile viewport (375x667): primary on top, secondary in row below
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/about');

    const heroSection = page.locator('section.relative').first();
    const actionRow = heroSection.locator('div.pt-3.flex');
    await expect(actionRow).toBeVisible();

    const bookCallBtn = actionRow.getByRole('link', { name: BOOK_CALL_REGEX });
    const viewWorkBtn = actionRow.getByRole('link', {
      name: VIEW_PROJECTS_REGEX
    });
    await expect(bookCallBtn).toBeVisible();
    await expect(viewWorkBtn).toBeVisible();

    const mobileBookBox = await bookCallBtn.boundingBox();
    const mobileWorkBox = await viewWorkBtn.boundingBox();
    expect(mobileBookBox).not.toBeNull();
    expect(mobileWorkBox).not.toBeNull();
    if (mobileBookBox && mobileWorkBox) {
      expect(mobileBookBox.y + mobileBookBox.height).toBeLessThanOrEqual(
        mobileWorkBox.y
      );
    }

    // 2. Desktop viewport (1024x768): buttons side-by-side in same row
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/about');

    const deskHeroSection = page.locator('section.relative').first();
    const deskActionRow = deskHeroSection.locator('div.pt-3.flex');
    const deskBookBtn = deskActionRow.getByRole('link', {
      name: BOOK_CALL_REGEX
    });
    const deskWorkBtn = deskActionRow.getByRole('link', {
      name: VIEW_PROJECTS_REGEX
    });

    const deskBookBox = await deskBookBtn.boundingBox();
    const deskWorkBox = await deskWorkBtn.boundingBox();
    expect(deskBookBox).not.toBeNull();
    expect(deskWorkBox).not.toBeNull();
    if (deskBookBox && deskWorkBox) {
      // Buttons sit side-by-side horizontally
      expect(deskBookBox.x + deskBookBox.width).toBeLessThanOrEqual(
        deskWorkBox.x
      );
      // Buttons share the same row vertically
      expect(Math.abs(deskBookBox.y - deskWorkBox.y)).toBeLessThanOrEqual(15);
    }
  });

  test('space between secondary button to divider and divider to subtitle tag is balanced', async ({
    page
  }) => {
    await page.goto('/about');

    const heroSection = page.locator('section.relative').first();
    const viewProjectsBtn = heroSection.getByRole('link', {
      name: VIEW_PROJECTS_REGEX
    });
    const divider = page.locator(
      'section#philosophy img[alt*="Medieval Diamond Section Divider"]'
    );
    const subtitleTag = page.locator(
      'section#philosophy span:has-text("Core Philosophy")'
    );

    await expect(viewProjectsBtn).toBeVisible();
    await expect(divider).toBeVisible();
    await expect(subtitleTag).toBeVisible();

    const btnBox = await viewProjectsBtn.boundingBox();
    const dividerBox = await divider.boundingBox();
    const subtitleBox = await subtitleTag.boundingBox();

    expect(btnBox).not.toBeNull();
    expect(dividerBox).not.toBeNull();
    expect(subtitleBox).not.toBeNull();

    if (btnBox && dividerBox && subtitleBox) {
      const topGap = dividerBox.y - (btnBox.y + btnBox.height);
      const bottomGap = subtitleBox.y - (dividerBox.y + dividerBox.height);
      // Both gaps should be close to equal (within 20px)
      expect(Math.abs(topGap - bottomGap)).toBeLessThanOrEqual(20);
    }
  });
});
