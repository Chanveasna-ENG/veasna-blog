// Need to break down too long too smelly
import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

// Define the shape of our search index based on TRD 2.4
interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: 'blog' | 'project' | 'participation' | 'learning' | 'random';
  tags: string[];
  author: string;
  date: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [indexData, setIndexData] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch the search index on component mount
  useEffect(() => {
    const fetchIndex = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) {
          throw new Error('Failed to load search index');
        }
        const data: SearchIndexItem[] = await response.json();
        setIndexData(data);
      } catch (err) {
        console.error('Search Index Error:', err);
        setError('Search unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndex();
  }, []);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform fuzzy search when query or index changes
  useEffect(() => {
    if (!query.trim() || indexData.length === 0) {
      setResults([]);
      return;
    }

    // Configure Fuse.js per TRD specifications
    const fuse = new Fuse(indexData, {
      keys: ['title', 'description'],
      threshold: 0.3, // Fuzzy tolerance
      includeScore: true
    });

    const searchResults = fuse.search(query);
    // Extract the original items from the search results and limit to 5
    setResults(searchResults.map((result) => result.item).slice(0, 5));
  }, [query, indexData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchContainerRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Magnifying Glass Icon */}
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-full leading-5 bg-darkBg text-offWhite placeholder-gray-400 focus:outline-none focus:bg-gray-800 focus:border-gold focus:ring-1 focus:ring-gold sm:text-sm transition-colors duration-200 shadow-sm"
          placeholder="Search posts..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          aria-label="Search posts"
          disabled={isLoading || error !== null}
        />
        {/* Loading Indicator inside input */}
        {isLoading && (
           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
           </div>
        )}
      </div>

      {/* Results Dropdown */}
      {isFocused && query.trim() !== '' && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-4 text-sm text-red-400 text-center">{error}</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result) => (
                <li key={result.slug}>
                  <a
                    href={`/posts/${result.slug}`}
                    className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-medium text-gold truncate">{result.title}</h4>
                      <span className="text-xs text-gray-400 uppercase tracking-wider ml-2 bg-gray-900 px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2">{result.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-400 text-center">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}