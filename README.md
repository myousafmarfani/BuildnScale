# Professional Content Platform


A production-ready content platform built with Next.js 14, TypeScript, and Tailwind CSS. Features a minimal, Vercel-inspired design with comprehensive blog functionality, learning roadmaps, project portfolio, and affiliate resources.

## Features

- ✨ **Modern Design**: Clean, minimal aesthetic inspired by Vercel
- 📝 **MDX Blog**: Full-featured blog with syntax highlighting and TOC
- 🌓 **Dark Mode**: Persistent dark mode with smooth transitions
- 🔍 **Search**: Real-time search across all content
- 📱 **Responsive**: Mobile-first design that works everywhere
- 🚀 **SEO Optimized**: Meta tags, sitemap, robots.txt, structured data
- 📊 **Analytics Ready**: Google Analytics and Microsoft Clarity support
- 💌 **Newsletter**: Built-in newsletter subscription API
- 🎨 **Professional Images**: Aspect ratio maintained images throughout
- 📚 **Learning Roadmaps**: Showcase educational content
- 💼 **Portfolio**: Display projects with tech stack
- 🤝 **Affiliate Resources**: Monetization-ready resource section

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Content**: MDX with [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Code Highlighting**: [rehype-pretty-code](https://rehype-pretty-code.netlify.app/)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
website/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── blog/[slug]/         # Dynamic blog post pages
│   ├── search/              # Search page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
├── content/blog/           # MDX blog posts
├── lib/                   # Utility functions
└── types/                # TypeScript types
```

## Adding Blog Posts

Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Post Title"
excerpt: "Brief description"
date: "2026-02-25"
readTime: "5 min read"
tags: ["Next.js", "TypeScript"]
image: "https://images.unsplash.com/photo-xxx"
---

## Your Content Here
```

## Deployment

Deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Or build locally:
```bash
npm run build
npm start
```

## Author

**M. Yousuf**
- GitHub: [@myousafmarfani](https://github.com/myousafmarfani)
- LinkedIn: [myousafmarfani](https://linkedin.com/in/myousafmarfani)
- Twitter: [@myousaf_codes](https://x.com/myousaf_codes)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
