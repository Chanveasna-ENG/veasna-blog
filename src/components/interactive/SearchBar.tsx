import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * Strict category typing based on TRD Discriminated Union
 */
type PostCategory = 'blog' | 'project' | 'participation' | 'learning' | 'random';

interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: PostCategory;
  tags: string[];
  author: string;
  date: string;
}

const SEARCH_CONFIG = {
  KEYS: ['title', 'description', 'category', 'tags', 'author'],
  THRESHOLD: 0.3,
  LIMIT: 5,
  INDEX_PATH: '/search-index.json',
};

/**
 * Senior Implementation: SearchBar
 * Isolated logic for fuzzy search and index fetching.
 */
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [indexData, setIndexData] = useState<SearchIndexItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse instance only when indexData changes (Performance)
  const fuse = useMemo(() => {
    if (indexData.length === 0) return null;
    return new Fuse(indexData, {
      keys: SEARCH_CONFIG.KEYS,
      threshold: SEARCH_CONFIG.THRESHOLD,
      includeScore: true,
    });
  }, [indexData]);

  useEffect(() => {
    const fetchIndex = async () => {
      setStatus('loading');
      try {
        const response = await fetch(SEARCH_CONFIG.INDEX_PATH);
        if (!response.ok) throw new Error('Fetch failed');
        
        const data: SearchIndexItem[] = await response.json();
        setIndexData(data);
        setStatus('idle');
      } catch (err) {
        setStatus('error');
        console.error(err);
      }
    };

    fetchIndex();
  }, []);

  useEffect(() => {
    const nav = document.getElementById('main-nav');
    if (nav) {
      if (isExpanded) {
        nav.classList.add('search-expanded');
      } else {
        // Wait for the 300ms CSS transition to finish before restoring the flex layout
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
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Effect: Run Search Logic
  useEffect(() => {
    if (!query.trim() || !fuse) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    const flatResults = searchResults
      .map((r) => r.item)
      .slice(0, SEARCH_CONFIG.LIMIT);
      
    setResults(flatResults);
  }, [query, fuse]);

  // Handle Enter Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      globalThis.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-[calc(100vw-6rem)] sm:w-80 md:w-96' : 'w-8'}`} ref={searchContainerRef}>
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
        <div className="absolute z-50 w-72 right-0 sm:left-0 sm:w-full mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 max-h-96 overflow-hidden">
          <SearchResultsList results={results} status={status} query={query} />
        </div>
      )}
    </div>
  );
}

/**
 * Sub-component: SearchResultsList
 * Implementation of "Single Responsibility" at the component level.
 */
function SearchResultsList({ 
  results, 
  status, 
  query 
}: { 
  readonly results: SearchIndexItem[]; 
  readonly status: string; 
  readonly query: string; 
}) {
  if (status === 'error') {
    return <div className="p-4 text-sm text-red-400 text-center">Search index unavailable.</div>;
  }

  if (results.length === 0) {
    return <div className="p-4 text-sm text-gray-500 text-center">No matches for "{query}"</div>;
  }

  return (
    <ul className="py-2">
      {results.map((item) => (
        <li key={item.slug}>
          <a
            href={`/posts/${item.slug}`}
            className="block px-4 py-3 hover:bg-gray-800 transition-colors group"
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gold group-hover:text-yellow-400 truncate">
                {item.title}
              </h4>
              <span className="text-[10px] text-gray-400 uppercase font-bold bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                {item.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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