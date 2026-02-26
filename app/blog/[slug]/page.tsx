import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Calendar,
  Clock,
  Github,
  Linkedin,
  Twitter,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { formatDate, extractHeadings } from '@/lib/utils';
import BlogSidebar from '@/components/sidebar';
import ScrollAwareSidebar from '@/components/scroll-aware-sidebar';
import TableOfContents from '@/components/table-of-contents';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import CodeBlock from '@/components/code-block';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | M. Yousuf`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-8 xl:gap-12">

        {/* ── Left: Table of Contents ──────────────────────────── */}
        <aside className="hidden lg:block">
          <ScrollAwareSidebar className="pr-1">
            <TableOfContents headings={headings} />
          </ScrollAwareSidebar>
        </aside>

        {/* ── Center: Article ──────────────────────────────────── */}
        <article className="min-w-0 space-y-8">

          {/* Article header */}
          <header className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              {/* Author */}
              <Link href="/author" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  MY
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500 transition-colors">{post.author.name}</span>
              </Link>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-blue-500 to-cyan-600">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover opacity-90"
            />
          </div>

          {/* MDX Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              components={{ pre: CodeBlock }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: 'github-dark',
                        keepBackground: false,
                      },
                    ],
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'wrap',
                        properties: { className: ['anchor'] },
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-sm text-zinc-500 flex items-center gap-1.5">
              <Share2 size={14} />
              Share this post
            </span>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              LinkedIn
            </a>
          </div>

          {/* Author Bio */}
          <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
              MY
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">Written by</p>
              <Link href="/author" className="group/name inline-block font-bold mb-1 hover:text-blue-500 transition-colors">
                M. Yousuf
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                Full-Stack Developer learning ML, DL &amp; Agentic AI. Student at GIAIC, building
                production-ready applications with Next.js, FastAPI, and modern AI tools.
              </p>
              <div className="flex items-center gap-2">
                <a href="https://github.com/myousafmarfani" target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <Github size={15} />
                </a>
                <a href="https://linkedin.com/in/myousafmarfani" target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <Linkedin size={15} />
                </a>
                <a href="https://x.com/myousaf_codes" target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <Twitter size={15} />
                </a>
                <Link href="/author" className="ml-auto text-xs text-blue-500 hover:underline font-medium">
                  View full profile →
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="space-y-5">
              <h3 className="text-xl font-bold">Related Posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp, idx) => (
                  <Link key={idx} href={`/blog/${rp.slug}`}
                    className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-sm font-bold leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">{rp.title}</h4>
                      <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={10} />{rp.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* ── Right: Blog Sidebar (Newsletter + Fiverr) ─────────── */}
        <aside className="hidden lg:block">
          <ScrollAwareSidebar>
            <BlogSidebar />
          </ScrollAwareSidebar>
        </aside>
      </div>
    </main>
  );
}

