import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { type SearchResultItem, search } from '../../utils/search';

/**
 * SearchBar: Navbar quick-search component powered by Pagefind
 */
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nav = document.getElementById('main-nav');
    if (nav) {
      if (isExpanded) {
        nav.classList.add('search-expanded');
      } else {
        const timer = setTimeout(() => {
          nav.classList.remove('search-expanded');
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
        if (query.trim() === '') {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [query]);

  // Query Pagefind with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    const timer = setTimeout(async () => {
      try {
        const searchResults = await search(trimmed, 5);
        setResults(searchResults);
        setStatus('idle');
      } catch {
        setStatus('error');
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      globalThis.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-[calc(100vw-6rem)] sm:w-80 md:w-96' : 'w-8'}`}
      ref={searchContainerRef}
    >
      {isExpanded ? (
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-full bg-darkBg text-offWhite placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold sm:text-base transition-all shadow-sm"
            placeholder="Search logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            disabled={status === 'error'}
          />
          {status === 'loading' && <LoadingSpinner />}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="text-gray-300 hover:text-gold transition-colors focus:outline-none flex items-center justify-center mt-1"
          aria-label="Open search"
        >
          <SearchIcon />
        </button>
      )}

      {isExpanded && isFocused && query.trim() !== '' && (
        <div className="absolute z-50 w-full left-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 max-h-96 overflow-hidden">
          <SearchResultsList results={results} status={status} query={query} />
        </div>
      )}
    </div>
  );
}

function SearchResultsList({
  results,
  status,
  query
}: {
  readonly results: SearchResultItem[];
  readonly status: string;
  readonly query: string;
}) {
  if (status === 'error') {
    return (
      <div className="p-4 text-sm text-red-400 text-center">
        Search index unavailable.
      </div>
    );
  }

  if (results.length === 0 && status !== 'loading') {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No matches for "{query}"
      </div>
    );
  }

  return (
    <ul className="py-2">
      {results.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className="block px-4 py-3 hover:bg-gray-800 transition-colors group"
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gold group-hover:text-yellow-400 truncate">
                {item.title}
              </h4>
              {item.category && (
                <span className="text-[10px] text-gray-400 uppercase font-bold bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                  {item.category}
                </span>
              )}
            </div>
            <p
              className="text-xs text-gray-400 line-clamp-1"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind produces trusted sanitized excerpt html
              dangerouslySetInnerHTML={{ __html: item.excerpt }}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
      <div className="h-3 w-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}
