import type { Metadata, Viewport } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://buildnscale.dev"),
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
  authors: [{ name: "Muhammad Yousaf", url: "https://buildnscale.dev" }],
  creator: "buildnscale.dev",
  publisher: "buildnscale.dev",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buildnscale.dev",
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
      <head />
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
