import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { WebSiteStructuredData, PersonStructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BuildnScale - Full-Stack Development & Agentic AI Enthusiast",
  description: "Learn full-stack and Agentic AI development with integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
  keywords: ["Next.js", "FastAPI", "AI", "Full-Stack Development", "Python", "TypeScript"],
  authors: [{ name: "Muhammad Yousaf Marfani" }],
  creator: "Muhammad Yousaf Marfani",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "BuildnScale - Full-Stack Development & Agentic AI Enthusiast",
    description: "Learn full-stack and Agentic AI development with integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
    siteName: "BuildnScale",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildnScale - Full-Stack Development & Agentic AI Enthusiast",
    description: "Learn full-stack and Agentic AI development with integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
    creator: "@MuhammadYousafMarfani",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <WebSiteStructuredData />
        <PersonStructuredData />
        <meta name="google-site-verification" content="s9faGWURF6VDwYE3r0NexHCUTcie24oCK_9SY2ARfxM" />
        <meta name="msvalidate.01" content="B97BD30FA9C112E8070A4860E1E77751" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-inter antialiased`}>
        <Providers>
          <Navigation />
          {/* Spacer for fixed navigation bar */}
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
