import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { WebSiteStructuredData, PersonStructuredData } from "@/components/structured-data";

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
  title: "M. Yousuf - Full-Stack Developer & AI Enthusiast",
  description: "Learn full-stack development with AI integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
  keywords: ["Next.js", "FastAPI", "AI", "Full-Stack Development", "Python", "TypeScript"],
  authors: [{ name: "M. Yousuf" }],
  creator: "M. Yousuf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "M. Yousuf - Full-Stack Developer & AI Enthusiast",
    description: "Learn full-stack development with AI integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
    siteName: "M. Yousuf",
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Yousuf - Full-Stack Developer & AI Enthusiast",
    description: "Learn full-stack development with AI integration. Building production-ready applications with Next.js, FastAPI, and modern technologies.",
    creator: "@myousaf_codes",
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
      </body>
    </html>
  );
}
