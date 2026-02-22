import React, { useState, useEffect, useMemo } from 'react';

// Defines the strict shape of data required for filtering and sorting
export interface FilterPostItem {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string; // ISO String representation of lastModifiedAt or createdAt
}

interface FilterProps {
  posts: FilterPostItem[];
  onUpdate: (filteredAndSortedPosts: FilterPostItem[]) => void;
}

export default function Filter({ posts, onUpdate }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('date-desc');

  // Extract a perfectly unique, alphabetically sorted array of tags from the provided posts
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Execute the filter and sort logic whenever inputs or state variables change
  useEffect(() => {
    // 1. Filter Logic (Pure, immutable evaluation)
    const filteredPosts = posts.filter((post) => {
      const isCategoryMatch = selectedCategory === 'All' || post.category === selectedCategory;
      const isTagMatch = selectedTag === 'All' || post.tags.includes(selectedTag);
      
      return isCategoryMatch && isTagMatch;
    });

    // 2. Sorting Logic (Create a shallow copy to prevent mutating the filtered array)
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();

      switch (sortOrder) {
        case 'date-desc':
          return timeB - timeA;
        case 'date-asc':
          return timeA - timeB;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    // 3. Emit Result
    onUpdate(sortedPosts);
  }, [posts, selectedCategory, selectedTag, sortOrder, onUpdate]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
      
      {/* Filters Group */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        
        {/* Category Filter */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="category-filter" className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-600 rounded-md bg-darkBg text-offWhite focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors shadow-sm cursor-pointer appearance-none"
          >
            <option value="All">All Categories</option>
            <option value="blog">Blog</option>
            <option value="project">Project</option>
            <option value="learning">Learning</option>
            <option value="participation">Participation</option>
            <option value="random">Random</option>
          </select>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="tag-filter" className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Tag
          </label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-600 rounded-md bg-darkBg text-offWhite focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors shadow-sm cursor-pointer appearance-none"
          >
            <option value="All">All Tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sorting Group */}
      <div className="flex flex-col space-y-1 w-full sm:w-auto">
        <label htmlFor="sort-order" className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          Sort By
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-600 rounded-md bg-darkBg text-offWhite focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors shadow-sm cursor-pointer appearance-none"
        >
          <option value="date-desc">Date: Newest First</option>
          <option value="date-asc">Date: Oldest First</option>
          <option value="title-asc">Title: A - Z</option>
          <option value="title-desc">Title: Z - A</option>
        </select>
      </div>

    </div>
  );
}