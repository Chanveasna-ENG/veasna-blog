import { describe, expect, it } from 'vitest';
import {
  UPWORK_MODE_TTL_MS,
  UPWORK_STORAGE_KEY,
  appendUpworkParam,
  isOffPlatformHref,
  resolveUpworkMode,
  shouldRedirectToUpwork
} from './upwork-mode';

describe('upwork-mode utility', () => {
  const mockNow = 1700000000000;

  describe('constants', () => {
    it('defines 24h TTL and storage key', () => {
      expect(UPWORK_MODE_TTL_MS).toBe(24 * 60 * 60 * 1000);
      expect(UPWORK_STORAGE_KEY).toBe('upwork_mode_expiry');
    });
  });

  describe('resolveUpworkMode', () => {
    it('activates and sets 24h expiry when ?upwork=true is in query', () => {
      const result = resolveUpworkMode({
        search: '?upwork=true',
        storedExpiry: null,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(true);
      expect(result.newExpiry).toBe(mockNow + 24 * 60 * 60 * 1000);
      expect(result.shouldClear).toBe(false);
    });

    it('renews 24h expiry when ?upwork=true even if already stored', () => {
      const existingExpiry = String(mockNow + 1000);
      const result = resolveUpworkMode({
        search: '?foo=bar&upwork=true',
        storedExpiry: existingExpiry,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(true);
      expect(result.newExpiry).toBe(mockNow + 24 * 60 * 60 * 1000);
      expect(result.shouldClear).toBe(false);
    });

    it('activates from valid unexpired stored expiry without URL param', () => {
      const futureExpiry = String(mockNow + 3600000); // 1 hour remaining
      const result = resolveUpworkMode({
        search: '',
        storedExpiry: futureExpiry,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(true);
      expect(result.newExpiry).toBeNull();
      expect(result.shouldClear).toBe(false);
    });

    it('clears expired storage and deactivates when expiry timestamp is in past', () => {
      const pastExpiry = String(mockNow - 1000);
      const result = resolveUpworkMode({
        search: '',
        storedExpiry: pastExpiry,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(false);
      expect(result.newExpiry).toBeNull();
      expect(result.shouldClear).toBe(true);
    });

    it('clears corrupt non-numeric stored expiry and deactivates', () => {
      const result = resolveUpworkMode({
        search: '',
        storedExpiry: 'not-a-number',
        currentTime: mockNow
      });

      expect(result.isActive).toBe(false);
      expect(result.newExpiry).toBeNull();
      expect(result.shouldClear).toBe(true);
    });

    it('returns inactive when no param and no stored value', () => {
      const result = resolveUpworkMode({
        search: '',
        storedExpiry: null,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(false);
      expect(result.newExpiry).toBeNull();
      expect(result.shouldClear).toBe(false);
    });

    it('does not activate if upwork param is false', () => {
      const result = resolveUpworkMode({
        search: '?upwork=false',
        storedExpiry: null,
        currentTime: mockNow
      });

      expect(result.isActive).toBe(false);
      expect(result.newExpiry).toBeNull();
      expect(result.shouldClear).toBe(false);
    });
  });

  describe('shouldRedirectToUpwork', () => {
    it('redirects /contact and /book-a-call when active', () => {
      expect(shouldRedirectToUpwork('/contact', true)).toBe(true);
      expect(shouldRedirectToUpwork('/contact/', true)).toBe(true);
      expect(shouldRedirectToUpwork('/book-a-call', true)).toBe(true);
      expect(shouldRedirectToUpwork('/book-a-call/', true)).toBe(true);
    });

    it('does not redirect permitted routes when active', () => {
      expect(shouldRedirectToUpwork('/', true)).toBe(false);
      expect(shouldRedirectToUpwork('/about', true)).toBe(false);
      expect(shouldRedirectToUpwork('/portfolio', true)).toBe(false);
      expect(shouldRedirectToUpwork('/page/1', true)).toBe(false);
    });

    it('never redirects when inactive', () => {
      expect(shouldRedirectToUpwork('/contact', false)).toBe(false);
      expect(shouldRedirectToUpwork('/book-a-call', false)).toBe(false);
    });
  });

  describe('isOffPlatformHref', () => {
    it('identifies relative and absolute off-platform endpoints and mailto links', () => {
      expect(isOffPlatformHref('/contact')).toBe(true);
      expect(isOffPlatformHref('/contact/')).toBe(true);
      expect(isOffPlatformHref('/contact?subject=test')).toBe(true);
      expect(isOffPlatformHref('/book-a-call')).toBe(true);
      expect(isOffPlatformHref('/book-a-call/')).toBe(true);
      expect(isOffPlatformHref('https://chanveasna.eng/contact')).toBe(true);
      expect(isOffPlatformHref('https://chanveasna.eng/book-a-call')).toBe(
        true
      );
      expect(isOffPlatformHref('mailto:contact@chanveasna.eng')).toBe(true);
      expect(isOffPlatformHref('mailto:user@domain.com?subject=Inquiry')).toBe(
        true
      );
    });

    it('returns false for non-contact links', () => {
      expect(isOffPlatformHref('/')).toBe(false);
      expect(isOffPlatformHref('/portfolio')).toBe(false);
      expect(isOffPlatformHref('#contact')).toBe(false);
      expect(isOffPlatformHref('tel:+123456789')).toBe(false);
    });
  });

  describe('appendUpworkParam', () => {
    it('appends ?upwork=true to clean internal route path', () => {
      expect(appendUpworkParam('/portfolio')).toBe('/portfolio?upwork=true');
      expect(appendUpworkParam('/about')).toBe('/about?upwork=true');
    });

    it('appends &upwork=true when query params already exist', () => {
      expect(appendUpworkParam('/blog?tag=automation')).toBe(
        '/blog?tag=automation&upwork=true'
      );
    });

    it('preserves hash fragments after query parameters', () => {
      expect(appendUpworkParam('/#services')).toBe('/?upwork=true#services');
      expect(appendUpworkParam('/about#story')).toBe(
        '/about?upwork=true#story'
      );
      expect(appendUpworkParam('/blog?tag=automation#summary')).toBe(
        '/blog?tag=automation&upwork=true#summary'
      );
    });

    it('does not duplicate upwork parameter if already present', () => {
      expect(appendUpworkParam('/portfolio?upwork=true')).toBe(
        '/portfolio?upwork=true'
      );
      expect(appendUpworkParam('/page/1?upwork=true#top')).toBe(
        '/page/1?upwork=true#top'
      );
    });

    it('ignores purely hash, mailto, tel, protocol-relative, and external URLs', () => {
      expect(appendUpworkParam('#pricing')).toBe('#pricing');
      expect(appendUpworkParam('mailto:hello@example.com')).toBe(
        'mailto:hello@example.com'
      );
      expect(appendUpworkParam('tel:+123456789')).toBe('tel:+123456789');
      expect(appendUpworkParam('https://upwork.com')).toBe(
        'https://upwork.com'
      );
      expect(appendUpworkParam('//upwork.com')).toBe('//upwork.com');
    });

    it('ignores static asset paths', () => {
      expect(appendUpworkParam('/wax-seal.png')).toBe('/wax-seal.png');
      expect(appendUpworkParam('/rss.xml')).toBe('/rss.xml');
      expect(appendUpworkParam('/svg/icon-upwork.svg')).toBe(
        '/svg/icon-upwork.svg'
      );
      expect(appendUpworkParam('/resume.pdf')).toBe('/resume.pdf');
    });
  });
});
