import { useEffect, useState } from 'react';
import { type SearchResultItem, search } from '../../utils/search';

export default function SearchFeed() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // 1. Grab URL query and perform search on mount
  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const q = params.get('q') || '';
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setStatus('idle');
      return;
    }

    const runSearch = async () => {
      setStatus('loading');
      try {
        const searchResults = await search(q);
        setResults(searchResults);
        setStatus('idle');
      } catch {
        setStatus('error');
      }
    };

    runSearch();
  }, []);

  // 2. Pagination Math
  const totalPages = Math.ceil(results.length / pageSize);
  const currentResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-alice text-gold mt-2 mb-2">
          Here is what you are looking for:{' '}
          <span className="text-offWhite">"{query}"</span>
        </h2>
      </div>

      <div className="flex flex-col space-y-6">
        {status === 'loading' && (
          <p className="text-gray-400">Loading search results...</p>
        )}
        {status === 'idle' && results.length === 0 && query && (
          <p className="text-gray-400">No matching content found.</p>
        )}

        {currentResults.map((post) => (
          <article
            key={post.url}
            className="p-6 bg-darkBg border border-gray-700 rounded-lg shadow-sm hover:border-gold transition-colors duration-200 group"
          >
            <a href={post.url} className="block">
              <h2 className="text-2xl font-alice text-gold group-hover:text-yellow-500 transition-colors duration-200 mb-2">
                {post.title}
              </h2>
              <p
                className="text-gray-300 mb-4 line-clamp-3"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind produces trusted sanitized excerpt html
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 uppercase tracking-wider">
                {post.category && (
                  <span className="bg-gray-800 px-2 py-1 rounded text-gold border border-gray-700">
                    {post.category}
                  </span>
                )}
                {post.date && <time dateTime={post.date}>{post.date}</time>}
              </div>
            </a>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center space-x-2 border-t border-gray-700 pt-8">
          {/* << First Page */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border transition-colors ${currentPage > 1 ? 'border-gray-600 text-offWhite hover:border-gold hover:text-gold' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            &lt;&lt;
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border transition-colors ${currentPage > 1 ? 'border-gray-600 text-offWhite hover:border-gold hover:text-gold' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            &lt;
          </button>

          <div className="hidden sm:flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-md border transition-colors ${pageNum === currentPage ? 'border-gold text-darkBg bg-gold font-bold' : 'border-gray-600 text-offWhite hover:border-gold hover:text-gold'}`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Mobile Page Indicator */}
          <span className="sm:hidden text-sm text-gray-400 font-medium px-2">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border transition-colors ${currentPage < totalPages ? 'border-gray-600 text-offWhite hover:border-gold hover:text-gold' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            &gt;
          </button>

          {/* >> Last Page */}
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border transition-colors ${currentPage < totalPages ? 'border-gray-600 text-offWhite hover:border-gold hover:text-gold' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            &gt;&gt;
          </button>
        </nav>
      )}
    </div>
  );
}
