import { expect, test } from '@playwright/test';

const EXPLORE_ALL_REGEX = /Explore All Articles/i;
const SCOPE_BUILD_REGEX = /Scope This Build/i;
const CONTACT_SUBJECT_REGEX = /\/contact\?subject=/;
const PY_12_REGEX = /py-12/;
const MD_PY_16_REGEX = /md:py-16/;
const LEAD_PARAGRAPH_REGEX =
  /font-body text-lg sm:text-xl leading-relaxed text-ink text-center mb-6/;
const HERO_HEADING_REGEX =
  /font-heading text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide text-ink text-center mb-6/;
const SECTION_HEADING_REGEX =
  /font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-ink text-center mb-[34]/;
const HERO_SUBTITLE_TAG_REGEX =
  /inline-block font-heading font-semibold uppercase tracking-widest text-bronze border-bronze border bg-transparent text-xs md:text-sm px-4 py-1 mb-6/;
const SERVICES_SUBTITLE_TAG_REGEX =
  /inline-block font-heading font-semibold uppercase tracking-widest text-bronze border-bronze border bg-transparent text-xs px-3.5 py-1 mb-3/;
const ENGRAVED_SHADOW_REGEX = /engraved-shadow/;
const HOVER_BORDER_BRONZE_REGEX = /hover:border-bronze/;
const MT_6_REGEX = /mt-6/;
const SM_MT_8_REGEX = /sm:mt-8/;
const BOOK_FREE_CALL_REGEX = /Book a Free Call/i;
const READ_ARCHITECTURE_REGEX = /Read Case Study|Read Architecture/i;
const MB_0_REGEX = /mb-0/;
const MB_6_REGEX = /mb-6/;
const MB_8_REGEX = /mb-8/;
const INITIATE_DISCUSSION_REGEX = /Let's Talk About Your Project/i;
const BOOK_CONSULTATION_REGEX = /Book a Free Discovery Call/i;
const BG_CRIMSON_REGEX = /bg-crimson/;
const BG_INK_REGEX = /bg-ink/;
const W_FULL_REGEX = /w-full/;
const FLEX_REGEX = /flex/;
const ITEMS_CENTER_REGEX = /items-center/;
const JUSTIFY_CENTER_REGEX = /justify-center/;

test.describe('Homepage Expanded Sections & Navigation', () => {
  test('header renders updated navigation links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/#services'
    );
    await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/portfolio'
    );
    await expect(nav.getByRole('link', { name: 'Blogs' })).toHaveAttribute(
      'href',
      '/page/1'
    );
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  test('services section displays 3 core service cards with correct content', async ({
    page
  }) => {
    await page.goto('/#services');
    const servicesSection = page.locator('section#services');
    await expect(servicesSection).toBeVisible();

    await expect(
      servicesSection.getByRole('heading', {
        name: 'Workflow & Tool Integration'
      })
    ).toBeVisible();
    await expect(
      servicesSection.getByRole('heading', {
        name: 'Custom Bots & Chat Automations'
      })
    ).toBeVisible();
    await expect(
      servicesSection.getByRole('heading', {
        name: 'Custom Web Applications & Sites'
      })
    ).toBeVisible();

    const serviceCtas = servicesSection.locator('a[href*="/contact?subject="]');
    await expect(serviceCtas).toHaveCount(3);
    for (const cta of await serviceCtas.all()) {
      await expect(cta).toHaveClass(BG_CRIMSON_REGEX);
      await expect(cta).toHaveClass(ENGRAVED_SHADOW_REGEX);
    }
  });

  test('pricing section renders starting rate baselines', async ({ page }) => {
    await page.goto('/#pricing');
    const pricingSection = page.locator('section#pricing');
    await expect(pricingSection).toBeVisible();

    await expect(pricingSection.getByText('$600')).toBeVisible();
    await expect(pricingSection.getByText('$900')).toBeVisible();
    await expect(pricingSection.getByText('$2,500')).toBeVisible();
  });

  test('featured blog section displays recent technical guides and link to archive', async ({
    page
  }) => {
    await page.goto('/#blogs');
    const blogsSection = page.locator('section#blogs');
    await expect(blogsSection).toBeVisible();

    const articles = blogsSection.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const exploreLink = blogsSection.getByRole('link', {
      name: EXPLORE_ALL_REGEX
    });
    await expect(exploreLink).toHaveAttribute('href', '/page/1');
  });

  test('pricing card CTA button links to inquiry with pre-selected subject anchor', async ({
    page
  }) => {
    await page.goto('/');
    const scopeWorkflowBtn = page
      .locator('section#pricing')
      .getByRole('link', { name: SCOPE_BUILD_REGEX })
      .first();

    await expect(scopeWorkflowBtn).toHaveAttribute(
      'href',
      CONTACT_SUBJECT_REGEX
    );
  });

  test('homepage sections enforce responsive padding standards', async ({
    page
  }) => {
    await page.goto('/');
    const standardSectionIds = [
      'ecosystem',
      'architect',
      'services',
      'portfolio',
      'process',
      'pricing',
      'blogs',
      'contact',
      'faq'
    ];

    const heroSection = page.locator('section.overflow-hidden');
    await expect(heroSection).toHaveClass(PY_12_REGEX);
    await expect(heroSection).toHaveClass(MD_PY_16_REGEX);

    for (const id of standardSectionIds) {
      const sec = page.locator(`section#${id}`);
      await expect(sec).toHaveClass(PY_12_REGEX);
      await expect(sec).toHaveClass(MD_PY_16_REGEX);
    }
  });

  test('tools and frameworks subtitle tag peeks into initial desktop viewport', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const toolsSubtitle = page.locator(
      'section#ecosystem span:has-text("Tools & Frameworks")'
    );
    await expect(toolsSubtitle).toBeAttached();

    const box = await toolsSubtitle.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y).toBeLessThan(1080);
      expect(box.y).toBeGreaterThan(0);
    }

    const heading = page.locator('section#ecosystem h2');
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();
    if (headingBox) {
      expect(headingBox.y).toBeGreaterThanOrEqual(900);
    }
  });

  test('hero and section paragraphs enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroLeadContainer = page.locator(
      'section.overflow-hidden div.max-w-2xl.mx-auto > p'
    );
    await expect(heroLeadContainer).toBeVisible();
    await expect(heroLeadContainer).toHaveClass(LEAD_PARAGRAPH_REGEX);

    const portfolioLead = page.locator(
      'section#portfolio div.max-w-5xl.mx-auto > p'
    );
    await expect(portfolioLead).toBeVisible();
    await expect(portfolioLead).toHaveClass(LEAD_PARAGRAPH_REGEX);

    const servicesLead = page.locator(
      'section#services div.max-w-5xl.mx-auto > p'
    );
    await expect(servicesLead).toBeVisible();
    await expect(servicesLead).toHaveClass(LEAD_PARAGRAPH_REGEX);
  });

  test('headings enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroHeading = page.locator('section.overflow-hidden h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toHaveClass(HERO_HEADING_REGEX);

    const servicesHeading = page.locator('section#services h2');
    await expect(servicesHeading).toBeVisible();
    await expect(servicesHeading).toHaveClass(SECTION_HEADING_REGEX);
  });

  test('subtitle tags enforce token classes without custom class leakage', async ({
    page
  }) => {
    await page.goto('/');

    const heroSubtitle = page.locator(
      'section.overflow-hidden span:has-text("Web Development & Workflow Automation")'
    );
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toHaveClass(HERO_SUBTITLE_TAG_REGEX);

    const servicesSubtitle = page.locator(
      'section#services span:has-text("What I Do")'
    );
    await expect(servicesSubtitle).toBeVisible();
    await expect(servicesSubtitle).toHaveClass(SERVICES_SUBTITLE_TAG_REGEX);
  });

  test('composite SectionHeader renders subtitle, heading, paragraph, and divider across variants', async ({
    page
  }) => {
    await page.goto('/');

    // 1. Normal variant (services)
    const servicesHeader = page.locator(
      'section#services div.max-w-5xl.mx-auto.flex.flex-col.items-center'
    );
    await expect(servicesHeader).toBeVisible();

    const subtitle = servicesHeader.locator('span').first();
    await expect(subtitle).toHaveText('What I Do');

    const heading = servicesHeader.locator('h2');
    await expect(heading).toHaveText('Three Ways I Can Help Your Business');

    const paragraph = servicesHeader.locator('p');
    await expect(paragraph).toContainText(
      'Practical development and automation services'
    );

    const divider = servicesHeader
      .locator('div.w-full.flex.items-center')
      .first();
    await expect(divider).toBeVisible();

    // 2. Big variant (hero)
    const heroHeader = page.locator(
      'section.overflow-hidden div.max-w-4xl.mx-auto.flex.flex-col.items-center'
    );
    await expect(heroHeader).toBeVisible();
    await expect(heroHeader.locator('h1')).toHaveText(
      'Custom Websites & Automations Built for Growing Businesses'
    );

    // 3. Small variant (architect section & cards)
    const architectHeader = page.locator(
      'section#architect div.w-full.flex.flex-col.items-start'
    );
    await expect(architectHeader).toBeVisible();
    await expect(architectHeader.locator('h2')).toHaveText("Hi, I'm Veasna.");

    const processCardHeaders = page.locator(
      'section#process div.w-full.flex.flex-col.items-start'
    );
    await expect(processCardHeaders.first()).toBeVisible();

    // 4. Contact section
    const contactHeader = page.locator(
      'section#contact div.w-full.flex.flex-col.items-start'
    );
    await expect(contactHeader).toBeVisible();
    await expect(contactHeader.locator('h2')).toHaveText(
      'Tell Me About Your Project'
    );

    // 5. CTA section (no subtitle)
    const ctaHeader = page.locator(
      'section#cta div.max-w-4xl.mx-auto.flex.flex-col.items-center'
    );
    await expect(ctaHeader).toBeVisible();
    await expect(ctaHeader.locator('h2')).toHaveText(
      'Ready to Automate Your Busywork?'
    );
  });

  test('composite MedievalFrame renders outer border, 4 corners, and interactive shadow', async ({
    page
  }) => {
    await page.goto('/');

    // 1. Hero frame renders 4 corners
    const heroFrame = page.locator(
      'section.overflow-hidden div.medieval-frame'
    );
    await expect(heroFrame).toBeVisible();
    const heroCorners = heroFrame.locator('img[alt*="Medieval Corner"]');
    await expect(heroCorners).toHaveCount(4);

    // 2. CTA frame renders engraved shadow and 4 corners
    const ctaFrame = page.locator('section#cta div.medieval-frame');
    await expect(ctaFrame).toBeVisible();
    await expect(ctaFrame).toHaveClass(ENGRAVED_SHADOW_REGEX);
    const ctaCorners = ctaFrame.locator('img[alt*="Medieval Corner"]');
    await expect(ctaCorners).toHaveCount(4);

    // 3. Services cards render with 4 corners and hover class
    const serviceCards = page.locator('section#services div.medieval-frame');
    await expect(serviceCards.first()).toBeVisible();
    await expect(serviceCards.first()).toHaveClass(HOVER_BORDER_BRONZE_REGEX);
    const serviceCardCorners = serviceCards
      .first()
      .locator('img[alt*="Medieval Corner"]');
    await expect(serviceCardCorners).toHaveCount(4);
  });

  test('architect section renders 4 core social channels with vertical spacing', async ({
    page
  }) => {
    await page.goto('/#architect');
    const architectSection = page.locator('section#architect');
    await expect(architectSection).toBeVisible();

    const socialContainer = architectSection.locator(
      'div.flex.items-center.gap-2\\.5'
    );
    await expect(socialContainer).toBeVisible();
    await expect(socialContainer).toHaveClass(MT_6_REGEX);
    await expect(socialContainer).toHaveClass(SM_MT_8_REGEX);

    const socialLinks = socialContainer.locator('a[title]');
    await expect(socialLinks).toHaveCount(4);

    const connectFollow = architectSection.locator('text="Connect & Follow:"');
    await expect(connectFollow).not.toBeVisible();
  });

  test('project inquiry section renders all 8 social links and book call button to /book-a-call', async ({
    page
  }) => {
    await page.goto('/#contact');
    const contactSection = page.locator('section#contact');
    await expect(contactSection).toBeVisible();

    const socialLinks = contactSection.locator('a[title]');
    await expect(socialLinks).toHaveCount(8);

    const bookCallBtn = contactSection.getByRole('link', {
      name: BOOK_FREE_CALL_REGEX
    });
    await expect(bookCallBtn).toBeVisible();
    await expect(bookCallBtn).toHaveAttribute('href', '/book-a-call');
    await expect(bookCallBtn).toHaveClass(BG_CRIMSON_REGEX);
    await expect(bookCallBtn).toHaveClass(ENGRAVED_SHADOW_REGEX);
  });

  test('composite Accordion renders in FAQ section and toggles expansion', async ({
    page
  }) => {
    await page.goto('/#faq');
    const faqSection = page.locator('section#faq');
    await expect(faqSection).toBeVisible();

    const firstDetails = faqSection.locator('details').first();
    await expect(firstDetails).toBeVisible();
    await expect(firstDetails).not.toHaveAttribute('open', '');

    await firstDetails.locator('summary').click();
    await expect(firstDetails).toHaveAttribute('open', '');
    await expect(firstDetails.locator('p')).toBeVisible();
  });

  test('composite ProjectCard renders in slider and portfolio archive grid', async ({
    page
  }) => {
    // 1. Homepage slider variant renders portfolio-card-link
    await page.goto('/#portfolio');
    const sliderCards = page.locator('section#portfolio article');
    await expect(sliderCards.first()).toBeVisible();
    const sliderLink = sliderCards.first().locator('a.portfolio-card-link');
    await expect(sliderLink).toBeVisible();

    // 2. Portfolio archive grid variant renders full action button
    await page.goto('/portfolio');
    const gridCards = page.locator('main article, div.max-w-6xl article');
    await expect(gridCards.first()).toBeVisible();
    const gridButton = gridCards.first().getByRole('link', {
      name: READ_ARCHITECTURE_REGEX
    });
    await expect(gridButton).toBeVisible();
  });

  test('composite Checklist renders with check and diamond bullet styles', async ({
    page
  }) => {
    await page.goto('/#services');
    const serviceList = page.locator('section#services ul');
    await expect(serviceList.first()).toBeVisible();
    await expect(serviceList.first().locator('li').first()).toContainText('✓');

    await page.goto('/#pricing');
    const pricingList = page.locator('section#pricing ul');
    await expect(pricingList.first()).toBeVisible();
    await expect(pricingList.first().locator('li').first()).toContainText('✦');
  });

  test('hero section collapses dead space when divider is absent', async ({
    page
  }) => {
    await page.goto('/');
    const heroHeader = page.locator(
      'section.overflow-hidden div.medieval-frame > div.max-w-4xl'
    );
    await expect(heroHeader).toBeVisible();
    await expect(heroHeader).toHaveClass(MB_0_REGEX);
    await expect(heroHeader).not.toHaveClass(MB_8_REGEX);

    const heroParagraph = heroHeader.locator('p');
    await expect(heroParagraph).toBeVisible();
    await expect(heroParagraph).toHaveClass(MB_6_REGEX);
  });

  test('fullWidth buttons enforce flexbox centering and full container width', async ({
    page
  }) => {
    await page.goto('/');

    // 1. Architect section fullWidth primary button
    const architectButton = page
      .locator('section#architect')
      .getByRole('link', { name: INITIATE_DISCUSSION_REGEX });
    await expect(architectButton).toBeVisible();
    await expect(architectButton).toHaveClass(W_FULL_REGEX);
    await expect(architectButton).toHaveClass(FLEX_REGEX);
    await expect(architectButton).toHaveClass(ITEMS_CENTER_REGEX);
    await expect(architectButton).toHaveClass(JUSTIFY_CENTER_REGEX);
    await expect(architectButton).toHaveClass(BG_CRIMSON_REGEX);
    await expect(architectButton).toHaveClass(ENGRAVED_SHADOW_REGEX);

    // 2. Pricing section fullWidth primary button
    const pricingButton = page
      .locator('section#pricing')
      .getByRole('link', { name: SCOPE_BUILD_REGEX })
      .first();
    await expect(pricingButton).toBeVisible();
    await expect(pricingButton).toHaveClass(W_FULL_REGEX);
    await expect(pricingButton).toHaveClass(FLEX_REGEX);
    await expect(pricingButton).toHaveClass(ITEMS_CENTER_REGEX);
    await expect(pricingButton).toHaveClass(JUSTIFY_CENTER_REGEX);
  });

  test('primary buttons and floating widget apply deep red styling and engraved shadow', async ({
    page
  }) => {
    await page.goto('/');

    const heroCta = page.getByRole('link', { name: BOOK_CONSULTATION_REGEX });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveClass(BG_CRIMSON_REGEX);
    await expect(heroCta).not.toHaveClass(BG_INK_REGEX);
    await expect(heroCta).toHaveClass(ENGRAVED_SHADOW_REGEX);

    const floatingWidget = page.locator('#floating-booking-widget');
    await expect(floatingWidget).toBeVisible();
    await expect(floatingWidget).toHaveClass(BG_CRIMSON_REGEX);
    await expect(floatingWidget).not.toHaveClass(BG_INK_REGEX);

    const shadowValue = await heroCta.evaluate(
      (el) => window.getComputedStyle(el).boxShadow
    );
    expect(shadowValue).toContain('rgb(48, 0, 0)');
    expect(shadowValue).toContain('4px 4px 0px 0px');
  });
});
