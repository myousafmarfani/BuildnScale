import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — buildnscale.dev',
  description:
    'Sign in to buildnscale.dev to sync your daily focus, habits, and productivity data across devices.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
