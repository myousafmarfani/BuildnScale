import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buildnscale.dev"),
  title: {
    default: "BuildnScale - Full-Stack & Agentic AI Engineering Blog",
    template: "%s | BuildnScale",
  },
  description:
    "Production-focused tutorials on Next.js 15, FastAPI, LangChain, RAG pipelines, and Agentic AI. Written by M. Yousaf Marfani from real engineering experience.",
  keywords: [
    "Next.js 15 tutorials",
    "FastAPI production guide",
    "LangChain RAG pipeline",
    "Agentic AI development",
    "Full-stack developer blog",
    "TypeScript advanced patterns",
    "Python AI engineering",
    "multi-agent systems",
    "AI chatbot development",
    "production web applications",
  ],
  authors: [{ name: "M. Yousaf Marfani", url: "https://www.buildnscale.dev/author" }],
  creator: "M. Yousaf Marfani",
  publisher: "BuildnScale",
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.buildnscale.dev",
    siteName: "BuildnScale",
    title: "BuildnScale - Full-Stack & Agentic AI Engineering Blog",
    description:
      "Production-focused tutorials on Next.js 15, FastAPI, LangChain, RAG pipelines, and Agentic AI.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "BuildnScale - Full-Stack & Agentic AI Engineering Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@buildnscale",
    creator: "@yousaf_codes",
    title: "BuildnScale - Full-Stack & Agentic AI Engineering Blog",
    description:
      "Production-focused tutorials on Next.js 15, FastAPI, LangChain, and Agentic AI.",
    images: ["/api/og"],
  },
  alternates: {
    canonical: "https://www.buildnscale.dev",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BuildnScale",
  url: "https://www.buildnscale.dev",
  description: "Production-focused engineering blog on Next.js, FastAPI, and Agentic AI.",
  publisher: {
    "@type": "Person",
    name: "M. Yousaf Marfani",
    url: "https://www.buildnscale.dev/author",
    sameAs: ["https://github.com/myousafmarfani", "https://www.fiverr.com/yousaf_codes"],
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.buildnscale.dev/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BuildnScale",
  url: "https://www.buildnscale.dev",
  founder: {
    "@type": "Person",
    name: "M. Yousaf Marfani",
    url: "https://www.buildnscale.dev/author",
  },
  sameAs: ["https://github.com/myousafmarfani", "https://www.fiverr.com/yousaf_codes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="Ue1LwsRs0zqtVTyE9A5ZoptmSGY55i2c8GnNAPJFXMI"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-inter antialiased`}
      >
        <Providers>
          <Navigation />
          {/* Spacer for fixed navigation bar */}
          <div className="pt-16">{children}</div>
          <Footer />
        </Providers>
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
