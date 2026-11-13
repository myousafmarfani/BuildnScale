import { MetadataRoute } from "next"

const DISALLOW = ["/api/", "/dashboard", "/dashboard/"]

// Search and assistant crawlers used by Google, OpenAI, Anthropic, Perplexity,
// Common Crawl, Apple, Meta, and Amazon. Allowing them keeps the price data and
// methodology answerable with a citation.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: "https://www.buildnscale.dev/sitemap.xml",
    host: "https://www.buildnscale.dev",
  }
}
