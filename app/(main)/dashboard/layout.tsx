import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — buildnscale.dev',
  description: 'Your buildnscale.dev dashboard — view focus time, habit streaks, and task completion stats.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
