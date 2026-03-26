import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPost[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || data.description,
        date: data.date,
        updatedAt: data.updatedAt || data.date,
        readTime: data.readTime || data.readingTime || '5 min read',
        tags: data.tags || [],
        image: data.image,
        content,
        heroSectionPost: data.heroSectionPost === true,
        author: data.author || {
          name: 'M. Yousuf',
          avatar: '/avatar.jpg',
        },
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt || data.description,
      date: data.date,
      updatedAt: data.updatedAt || data.date,
      readTime: data.readTime || data.readingTime || '5 min read',
      tags: data.tags || [],
      image: data.image,
      content,
      heroSectionPost: data.heroSectionPost === true,
      author: data.author || {
        name: 'M. Yousuf',
        avatar: '/avatar.jpg',
      },
    } as BlogPost;
  } catch {
    return null;
  }
}

export function getFeaturedPost(): BlogPost | null {
  const posts = getAllPosts();
  return posts[0] || null;
}

export function getRecentPosts(limit: number = 3): BlogPost[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}

/**
 * Returns up to 3 posts marked as heroSectionPost=true (sorted by date desc).
 * If more than 3 are marked, only the 3 most recent are returned,
 * effectively "un-marking" any older ones at display time.
 */
export function getHeroSectionPosts(): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((p) => p.heroSectionPost === true).slice(0, 3);
}

export function searchPosts(query: string): BlogPost[] {
  const posts = getAllPosts();
  const lowerQuery = query.toLowerCase();
  
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
