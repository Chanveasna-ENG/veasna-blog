# Development Notes & Roadmap

## Pending Tasks & Improvements

### 1. Logo & Branding Assets
- **Change Logo SVG**: Replace the temporary/monkey wax seal logo SVG in the header, footer, wax seals, and favicon with custom brand vector assets.
- Ensure SVG scales cleanly across dark and light parchment backgrounds, maintaining the engraved medieval aesthetic.

### 2. Content & Media Updates
- **Update Content Images**: Replace placeholder blog post illustrations and case study screenshots with actual high-resolution project captures and diagrams.
- Add proper WebP formats with descriptive `alt` text for SEO and accessibility standards.

### 3. Search Performance Optimization
- **Performance Update Searching Method**:
  - Review Pagefind indexing configuration (`--site dist`) and client search bundle load time.
  - Optimize `SearchFeed.tsx` and `SearchBar.tsx` debounce, filtering latency, and memory footprint when querying large content collections.
  - Consider pre-fetching or lazy-loading search indices only on user interaction (`onFocus` / typing).
