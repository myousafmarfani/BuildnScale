import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, searchPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    // Return popular posts
    const posts = getAllPosts().slice(0, 5);
    return NextResponse.json({
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        readTime: post.readTime,
      })),
    });
  }

  // Search posts
  const results = searchPosts(query);
  return NextResponse.json({
    results: results.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      readTime: post.readTime,
    })),
  });
}
