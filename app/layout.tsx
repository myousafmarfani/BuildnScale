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
}

export const metadata: Metadata = {
  metadataBase: new URL("https://buildnscale.dev"),
  title: "buildnscale.dev — Productivity tools for developers who ship",
  description:
    "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "buildnscale.dev — Productivity tools for developers who ship",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
    url: "https://buildnscale.dev",
    siteName: "buildnscale.dev",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "buildnscale.dev — Productivity tools for developers who ship",
    description:
      "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
  },
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
