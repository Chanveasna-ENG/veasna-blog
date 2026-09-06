export interface PricingTier {
  id: string;
  title: string;
  startingPrice: number;
  currency: string;
  subtitle: string;
  turnaround: string;
  deliverables: string[];
  recommendedFor: string;
  ctaSubject: string;
}

export function getPricingTiers(): PricingTier[] {
  return [
    {
      id: 'automation',
      title: 'Workflow Automation',
      startingPrice: 600,
      currency: 'USD',
      subtitle: 'Connect your software and automate repetitive manual tasks.',
      turnaround: '1 – 2 Weeks',
      deliverables: [
        'Custom n8n / Make.com / Zapier architecture',
        'Multi-app webhook triggers & error recovery',
        'Autonomous CRM & lead qualification sync',
        'Deployment on self-hosted VPS or cloud runner',
        '14-day post-launch warranty & handover guide'
      ],
      recommendedFor:
        'Businesses spending hours each week on manual data entry.',
      ctaSubject: 'Workflow Automation (n8n / Make / Zapier)'
    },
    {
      id: 'bots',
      title: 'Messaging Bots',
      startingPrice: 900,
      currency: 'USD',
      subtitle: 'Automate customer inquiries and lead intake on chat channels.',
      turnaround: '2 – 3 Weeks',
      deliverables: [
        'Telegram, Discord, WhatsApp, Messenger, or IG bot',
        'Interactive command menu & rich media parsing',
        'Database state persistence (PostgreSQL / SQLite)',
        'Payment gateway or API webhook integrations',
        'Dockerized deployment & monitoring'
      ],
      recommendedFor: 'Communities and businesses needing 24/7 chat responses.',
      ctaSubject: 'Messaging & Social Bots (Telegram / Discord / WhatsApp)'
    },
    {
      id: 'ai-web',
      title: 'Custom Web Apps',
      startingPrice: 2500,
      currency: 'USD',
      subtitle:
        'Full-featured web platforms and client portals built from scratch.',
      turnaround: '3 – 5 Weeks',
      deliverables: [
        'Modern Astro / Next.js high-converting architecture',
        'Custom LLM agent & RAG knowledge base integration',
        'E-commerce or lead capture portal build',
        'Lighthouse 95+ performance & full SEO foundation',
        'Complete source code ownership & CI/CD deployment'
      ],
      recommendedFor:
        'Businesses needing a dedicated web product or internal tool.',
      ctaSubject: 'AI Systems & Custom Web Apps (Astro / Next.js / E-Commerce)'
    }
  ];
}

export function formatStartingPrice(amount: number, currency = 'USD'): string {
  const formatted = amount.toLocaleString('en-US');
  if (currency === 'USD') {
    return `$${formatted}`;
  }
  return `${formatted} ${currency}`;
}

export function getInquiryUrl(ctaSubject: string): string {
  return `/contact?subject=${encodeURIComponent(ctaSubject)}`;
}
