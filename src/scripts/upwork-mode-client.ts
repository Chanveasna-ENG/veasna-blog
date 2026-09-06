import { getUpworkUrl } from '../data/socials';
import { appendUpworkParam, isOffPlatformHref } from '../utils/upwork-mode';

function updateAnchorLabel(anchor: HTMLAnchorElement, newLabel: string): void {
  const contentSpan = anchor.querySelector<HTMLElement>('span.relative.z-10');
  if (contentSpan) {
    contentSpan.textContent = newLabel;
  } else {
    anchor.textContent = newLabel;
  }
}

const HIRE_WITH_ARROW_PHRASES = [
  'Book a Free Call',
  'Book Consultation',
  'Book Strategy Call',
  'Initiate Direct Contact',
  'Discuss Your Architecture',
  'Claim Strategy Call'
];

function getOffPlatformReplacementLabel(currentText: string): string | null {
  if (
    currentText.includes('Book A Call') ||
    currentText.includes('Book a Call')
  ) {
    return currentText.includes('→') ? 'Hire on Upwork →' : 'Hire on Upwork';
  }
  if (HIRE_WITH_ARROW_PHRASES.some((phrase) => currentText.includes(phrase))) {
    return 'Hire on Upwork →';
  }
  if (currentText.includes('Scope This Build')) {
    return 'Scope on Upwork →';
  }
  if (currentText.includes('Inquire Service')) {
    return 'Inquire on Upwork →';
  }
  if (currentText === 'Contact') {
    return 'Hire on Upwork';
  }
  return null;
}

function rewriteOffPlatformAnchor(
  anchor: HTMLAnchorElement,
  upworkUrl: string
): void {
  anchor.setAttribute('href', upworkUrl);
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('rel', 'noopener noreferrer');

  if (anchor.id === 'floating-booking-widget') {
    const titleSpan = anchor.querySelector<HTMLElement>('.font-heading');
    if (titleSpan) {
      titleSpan.textContent = 'Hire on Upwork';
    }
    return;
  }

  const currentText = anchor.textContent?.trim() || '';
  const newLabel = getOffPlatformReplacementLabel(currentText);
  if (newLabel) {
    updateAnchorLabel(anchor, newLabel);
  }
}

export function applyUpworkModeDom(): void {
  const isUpworkMode =
    document.documentElement.getAttribute('data-upwork-mode') === 'true';
  if (!isUpworkMode) {
    return;
  }

  const upworkUrl = getUpworkUrl();

  const links = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  for (const anchor of links) {
    const rawHref = anchor.getAttribute('href') || '';

    if (isOffPlatformHref(rawHref)) {
      rewriteOffPlatformAnchor(anchor, upworkUrl);
    } else {
      const newHref = appendUpworkParam(rawHref);
      if (newHref !== rawHref) {
        anchor.setAttribute('href', newHref);
      }
    }
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState !== 'loading') {
    applyUpworkModeDom();
  } else {
    document.addEventListener('DOMContentLoaded', applyUpworkModeDom);
  }
  document.addEventListener('astro:after-swap', applyUpworkModeDom);
}
