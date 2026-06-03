export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "buildnscale.dev",
    url: "https://www.buildnscale.dev",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.buildnscale.dev/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "buildnscale.dev",
    url: "https://www.buildnscale.dev",
    logo: "https://www.buildnscale.dev/og-image.png",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more.",
    founder: {
      "@type": "Person",
      name: "Muhammad Yousaf",
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function blogPostingJsonLd(post: {
  title: string
  excerpt: string
  date: string
  slug: string
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Muhammad Yousaf",
      url: "https://www.buildnscale.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "buildnscale.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://www.buildnscale.dev/og-image.png",
      },
    },
    url: `https://www.buildnscale.dev/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.buildnscale.dev/blog/${post.slug}`,
    },
    image: "https://www.buildnscale.dev/og-image.png",
    articleSection: post.category,
  }
}

export function softwareApplicationJsonLd(tool: {
  name: string
  description: string
  slug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `https://www.buildnscale.dev/tools/${tool.slug}`,
    applicationCategory: "Productivity",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }
}

export function faqPageJsonLd(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }
}
