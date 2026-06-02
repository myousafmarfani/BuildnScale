import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create account — buildnscale.dev',
  description:
    'Create a free account on buildnscale.dev. Sync your productivity tools across devices. No credit card required.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
