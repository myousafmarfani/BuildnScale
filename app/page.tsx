import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, BookOpen, Users, Star, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { getAllPosts, getHeroSectionPosts } from '@/lib/blog';
import { roadmaps, projects, affiliateResources } from '@/lib/data';
import HomepageSidebar from '@/components/homepage-sidebar';
import ScrollAwareSidebar from '@/components/scroll-aware-sidebar';
import { formatDate } from '@/lib/utils';

export default function Home() {
  const posts = getAllPosts();
  const heroPosts = getHeroSectionPosts();
  const heroPost = heroPosts[0];
  const heroSquarePosts = heroPosts.slice(1, 3);
  const resourceCards = [
    ...affiliateResources.slice(0, 5),
    {
      name: 'Explore all resources',
      category: 'Directories',
      description: 'Resources for learning, development, deployment, and AI tooling.',
      price: 'View all',
      discount: 'CTA',
      rating: 5,
      features: ['Learning', 'Development', 'Deployment', 'AI tooling'],
      link: '/resources',
      isCta: true,
    },
  ];

  // Feed posts: exclude the 3 hero posts to avoid duplication
  const heroSlugs = new Set(heroPosts.map((p) => p.slug));
  const feedPosts = posts.filter((p) => !heroSlugs.has(p.slug));
  const recentPosts = feedPosts.length > 0 ? feedPosts : posts.slice(3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ─── Hero Posts Grid: 1 Rectangle (60%) + 2 Squares (40%) ──── */}
      {heroPosts.length > 0 && (
        <section id="blog" className="pt-6 pb-20">
          <div className="flex flex-col lg:flex-row gap-4 lg:h-130">

            {/* Left — Rectangle (60% width, full height) */}
            {heroPost && (
              <Link
                href={`/blog/${heroPost.slug}`}
                className="group relative rounded-2xl overflow-hidden lg:w-[60%] h-72 lg:h-full shrink-0 bg-zinc-900 block"
              >
                <Image
                  src={heroPost.image}
                  alt={heroPost.title}
                  fill
                  priority
                  className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {heroPost.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/90 text-white font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                    {heroPost.title}
                  </h2>
                  <p className="text-sm text-zinc-300 line-clamp-2 hidden sm:block">
                    {heroPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatDate(heroPost.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {heroPost.readTime}
                    </span>
                  </div>
                </div>
                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-white -rotate-45" />
                </div>
              </Link>
            )}

            {/* Right — Two Squares (40% width, each = 50% height) */}
            {heroSquarePosts.length > 0 && (
              <div className="lg:flex-1 flex flex-col gap-4 lg:h-full">
                {heroSquarePosts.map((post, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/${post.slug}`}
                    className="group relative rounded-2xl overflow-hidden flex-1 h-44 lg:h-auto bg-zinc-900 block"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 space-y-2">
                      <div className="flex items-center gap-2">
                        {post.tags.slice(0, 1).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/80 text-white font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={11} className="text-white -rotate-45" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Main Content + Homepage Sidebar ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">

        {/* Main Feed (2/3) */}
        <div className="lg:col-span-2 space-y-16">

          {/* Latest Posts */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest Posts</h2>
              <Link href="/search" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                Browse all <ArrowRight size={14} />
              </Link>
            </div>
            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentPosts.map((post, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/${post.slug}`}
                    className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-base leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <span>{formatDate(post.date)}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">All posts are featured in the hero section above.</p>
            )}
          </section>

          {/* Learning Roadmaps */}
          <section id="roadmaps" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Roadmaps</h2>
            <div className="space-y-4">
              {roadmaps.map((roadmap, idx) => (
                <div key={idx} className="p-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{roadmap.title}</h3>
                    <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">{roadmap.description}</p>
                  <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><BookOpen size={14} />{roadmap.modules}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} />{roadmap.duration}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} />{roadmap.students}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section id="projects" className="space-y-6">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <a key={idx} href={project.github} target="_blank" rel="noopener noreferrer"
                  className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold group-hover:text-blue-500 transition-colors">{project.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{project.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tech.map((tech, ti) => (
                        <span key={ti} className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{tech}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Affiliate Resources */}
          <section id="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recommended Resources</h2>
              <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">Affiliate Links</span>
            </div>
            <div className="space-y-4">
              {resourceCards.map((resource, idx) => (
                // Keep CTA layout aligned with cards while centering content.
                <a
                  key={idx}
                  href={resource.link}
                  target={'isCta' in resource && resource.isCta ? undefined : '_blank'}
                  rel={'isCta' in resource && resource.isCta ? undefined : 'noopener noreferrer'}
                  className={`block p-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group ${'isCta' in resource && resource.isCta ? 'text-center' : ''}`}
                >
                  {'isCta' in resource && resource.isCta ? (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">More resources</span>
                      <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{resource.name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">{resource.description}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {resource.features.map((feature, fi) => (
                          <span key={fi} className="text-xs px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold shadow-sm group-hover:bg-blue-600 transition-colors">
                        Explore all resources <ArrowRight size={14} />
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">{resource.name}</h3>
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{resource.discount}</span>
                          </div>
                          <span className="text-xs text-zinc-400">{resource.category}</span>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-blue-500">{resource.price}</div>
                          <div className="flex items-center gap-1 text-xs justify-end mt-0.5">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-zinc-500">{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{resource.description}</p>
                      <div className="flex flex-wrap gap-3">
                        {resource.features.map((feature, fi) => (
                          <span key={fi} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <CheckCircle size={13} className="text-green-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Homepage Sidebar (1/3) */}
        <aside className="lg:col-span-1">
          <ScrollAwareSidebar>
            <HomepageSidebar posts={posts} />
          </ScrollAwareSidebar>
        </aside>
      </div>
    </main>
  );
}

