import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import { Providers } from "@/components/providers"
import "./globals.css"

const dmSans = localFont({
  src: "../public/fonts/DM_Sans.woff2",
  weight: "300 600",
  variable: "--font-dm-sans",
  display: "swap",
})

const jetbrainsMono = localFont({
  src: "../public/fonts/JetBrains_Mono.woff2",
  weight: "400 700",
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buildnscale.dev"),
  title: "buildnscale.dev — Productivity tools for developers who ship",
  description:
    "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required. Open-source, local-first, privacy-respecting.",
  keywords: [
    "productivity tools for developers",
    "free daily planner",
    "Pomodoro timer",
    "habit tracker",
    "markdown notes",
    "freelance rate calculator",
    "weekly review",
    "time blocking",
    "developer productivity",
    "open source productivity",
    "no signup tools",
    "local first apps",
  ],
  authors: [{ name: "Muhammad Yousaf", url: "https://www.buildnscale.dev" }],
  creator: "buildnscale.dev",
  publisher: "buildnscale.dev",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
},
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.buildnscale.dev",
    siteName: "buildnscale.dev",
    title: "buildnscale.dev — Productivity tools for developers who ship",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "buildnscale.dev — Productivity tools for developers who ship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "buildnscale.dev — Productivity tools for developers who ship",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
    images: ["/twitter-image"],
  },
  category: "technology",
  classification: "Productivity Tools",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="Ue1LwsRs0zqtVTyE9A5ZoptmSGY55i2c8GnNAPJFXMI" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VN79377ERT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VN79377ERT');
          `}
        </Script>
      </head>
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
