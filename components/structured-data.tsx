import { BlogPost } from '@/types/blog';

interface StructuredDataProps {
  post: BlogPost;
}

export function ArticleStructuredData({ post }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Person',
      name: 'M. Yousuf',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PersonStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'M. Yousuf',
    url: 'https://yourdomain.com',
    sameAs: [
      'https://github.com/myousafmarfani',
      'https://linkedin.com/in/myousafmarfani',
      'https://x.com/myousaf_codes',
    ],
    jobTitle: 'Full-Stack Developer',
    description: 'Learning ML, DL & Agentic AI. Building production-ready applications with Next.js, FastAPI, and modern AI tools.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebSiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'M. Yousuf - Full-Stack Developer & AI Enthusiast',
    url: 'https://yourdomain.com',
    description: 'Learn full-stack development with AI integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yourdomain.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
