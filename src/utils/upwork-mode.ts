export const UPWORK_MODE_TTL_MS = 24 * 60 * 60 * 1000;
export const UPWORK_STORAGE_KEY = 'upwork_mode_expiry';

const STATIC_ASSET_REGEX =
  /\.(png|jpg|jpeg|gif|svg|webp|ico|xml|txt|pdf|css|js|json|webmanifest)$/i;
const TRAILING_SLASH_REGEX = /\/$/;

export interface ResolveUpworkModeOptions {
  search: string;
  storedExpiry: string | null;
  currentTime?: number;
}

export interface ResolveUpworkModeResult {
  isActive: boolean;
  newExpiry: number | null;
  shouldClear: boolean;
}

export function resolveUpworkMode({
  search,
  storedExpiry,
  currentTime = Date.now()
}: ResolveUpworkModeOptions): ResolveUpworkModeResult {
  let hasUpworkParam = false;
  try {
    const searchParams = new URLSearchParams(search);
    hasUpworkParam = searchParams.get('upwork') === 'true';
  } catch {
    hasUpworkParam = false;
  }

  if (hasUpworkParam) {
    return {
      isActive: true,
      newExpiry: currentTime + UPWORK_MODE_TTL_MS,
      shouldClear: false
    };
  }

  if (storedExpiry !== null) {
    const expiryTimestamp = Number.parseInt(storedExpiry, 10);
    if (!Number.isNaN(expiryTimestamp) && expiryTimestamp > currentTime) {
      return {
        isActive: true,
        newExpiry: null,
        shouldClear: false
      };
    }
    return {
      isActive: false,
      newExpiry: null,
      shouldClear: true
    };
  }

  return {
    isActive: false,
    newExpiry: null,
    shouldClear: false
  };
}

export function shouldRedirectToUpwork(
  pathname: string,
  isActive: boolean
): boolean {
  if (!isActive) {
    return false;
  }
  const normalized = pathname.replace(TRAILING_SLASH_REGEX, '');
  return normalized === '/contact' || normalized === '/book-a-call';
}

export function isOffPlatformHref(href: string): boolean {
  if (!href) {
    return false;
  }
  const trimmed = href.trim();
  if (trimmed.startsWith('mailto:')) {
    return true;
  }
  if (trimmed.startsWith('#') || trimmed.startsWith('tel:')) {
    return false;
  }
  try {
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      const pathPart = trimmed
        .split('?')[0]
        .split('#')[0]
        .replace(TRAILING_SLASH_REGEX, '');
      return pathPart === '/contact' || pathPart === '/book-a-call';
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const pathPart = url.pathname.replace(TRAILING_SLASH_REGEX, '');
      return pathPart === '/contact' || pathPart === '/book-a-call';
    }
  } catch {
    return false;
  }
  return false;
}

export function appendUpworkParam(href: string): string {
  if (!href) {
    return href;
  }
  const trimmed = href.trim();

  // Exclude non-page or external protocols
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//')
  ) {
    return href;
  }

  // Exclude static assets
  const cleanPath = trimmed.split('?')[0].split('#')[0];
  if (STATIC_ASSET_REGEX.test(cleanPath)) {
    return href;
  }

  const hashIndex = trimmed.indexOf('#');
  const urlPart = hashIndex !== -1 ? trimmed.slice(0, hashIndex) : trimmed;
  const hashPart = hashIndex !== -1 ? trimmed.slice(hashIndex) : '';

  const queryIndex = urlPart.indexOf('?');
  const pathPart = queryIndex !== -1 ? urlPart.slice(0, queryIndex) : urlPart;
  const queryPart = queryIndex !== -1 ? urlPart.slice(queryIndex + 1) : '';

  const searchParams = new URLSearchParams(queryPart);
  if (searchParams.get('upwork') === 'true') {
    return href;
  }

  searchParams.set('upwork', 'true');
  const queryString = searchParams.toString();
  return `${pathPart}?${queryString}${hashPart}`;
}
