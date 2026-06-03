'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

export default function SignUpPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline">
          build<span className="text-teal">n</span>scale
        </Link>

        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="font-display text-2xl font-semibold text-center text-fg">
            Create your account.
          </h1>
          <p className="mt-3 text-sm text-center text-muted mb-8">
            Free forever. No credit card needed.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-xs text-danger">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full h-11 flex items-center justify-center gap-3 bg-surface border border-border rounded-md text-fg text-sm font-medium hover:bg-raised transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-8">
            <span className="flex-1 h-px bg-border" />
            <span className="text-2xs text-tertiary uppercase tracking-wider">or</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Muhammad Yousaf"
                className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="dev@company.com"
                required
                className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors bg-transparent border-none cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors bg-transparent border-none cursor-pointer"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <p className="text-2xs text-tertiary text-center leading-relaxed mb-5">
              By signing up, you agree to our{' '}
              <a href="/privacy" className="text-muted no-underline border-b border-border">Privacy Policy</a>{' '}
              and{' '}
              <a href="/terms" className="text-muted no-underline border-b border-border">Terms of Service</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-teal text-bg text-sm font-semibold rounded-md hover:bg-teal-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-8">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-teal no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
