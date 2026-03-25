'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
}

const popularTopics = ['FastAPI', 'Next.js', 'AI Chatbot', 'Authentication', 'Python', 'React'];

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularPosts, setPopularPosts] = useState<SearchResult[]>([]);

  useEffect(() => {
    // Fetch popular posts
    fetch('/api/search')
      .then((res) => res.json())
      .then((data) => setPopularPosts(data.posts || []))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      handleSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const displayPosts = query.trim().length > 0 ? results : popularPosts;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm mb-6"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Back</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Search</h1>
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-zinc-600 dark:text-zinc-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles, roadmaps, projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            {query.trim().length > 0
              ? `${loading ? 'Searching...' : `Results (${results.length})`}`
              : 'Popular Posts'}
          </h2>
          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">Searching...</div>
          ) : displayPosts.length > 0 ? (
            <div className="space-y-3">
              {displayPosts.map((post, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${post.slug}`}
                  className="block p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <h3 className="font-bold mb-1">{post.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    {post.excerpt}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{post.readTime}</p>
                </Link>
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="text-center">Loading search...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
