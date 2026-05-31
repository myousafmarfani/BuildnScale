'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurPw, setShowCurPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingError, setDeletingError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(t)
    }
  }, [message])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
        return
      }

      await update({ name })
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setChangingPassword(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
        return
      }

      setMessage({ type: 'success', text: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeletingError('')

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setDeletingError(data.error || 'Failed to delete account')
        setDeleting(false)
        return
      }

      await signOut({ callbackUrl: '/' })
    } catch {
      setDeletingError('Something went wrong')
      setDeleting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="spinner" />
      </div>
    )
  }

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() || '?'

  return (
    <div className="flex min-h-screen items-start justify-center p-5 pt-24">
      <div className="w-full max-w-[500px]">
        <Link href="/dashboard" className="font-display mx-auto mb-10 block w-fit text-base font-semibold text-fg no-underline">
          build<span className="text-teal">n</span>scale
        </Link>

        {message && (
          <div className={`mb-4 rounded-md border px-4 py-2.5 text-xs ${
            message.type === 'success'
              ? 'border-teal-muted bg-teal-subtle text-teal'
              : 'border-danger/40 bg-danger/10 text-danger'
          }`}>
            {message.text}
          </div>
        )}

        {/* Avatar + Email */}
        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-bg text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-sm font-medium text-fg">{session?.user?.name || 'User'}</div>
              <div className="text-xs text-tertiary">{session?.user?.email}</div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Email address</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-tertiary outline-none cursor-not-allowed"
              />
              <p className="text-2xs text-tertiary mt-1">Email cannot be changed</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-teal text-bg text-sm font-semibold rounded-md hover:bg-teal-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <h2 className="font-display text-sm font-semibold text-fg mb-6">Change password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Current password</label>
              <div className="relative">
                <input
                  type={showCurPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurPw(!showCurPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors bg-transparent border-none cursor-pointer text-xs"
                  aria-label={showCurPw ? 'Hide password' : 'Show password'}
                >
                  {showCurPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">New password</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors bg-transparent border-none cursor-pointer text-xs"
                  aria-label={showNewPw ? 'Hide password' : 'Show password'}
                >
                  {showNewPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">Confirm new password</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  className="w-full h-11 bg-raised border border-border rounded-md px-4 text-sm text-fg outline-none focus:border-teal transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors bg-transparent border-none cursor-pointer text-xs"
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full h-11 bg-teal text-bg text-sm font-semibold rounded-md hover:bg-teal-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {changingPassword ? 'Changing…' : 'Change password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface border border-danger/20 rounded-xl p-8 mb-6">
          <h2 className="font-display text-sm font-semibold text-danger mb-2">Danger zone</h2>
          <p className="text-xs text-tertiary mb-5">Once you delete your account, there is no going back.</p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full h-11 bg-danger/10 text-danger text-sm font-semibold rounded-md border border-danger/30 hover:bg-danger/20 transition-colors cursor-pointer"
            >
              Delete my account
            </button>
          ) : (
            <div>
              {deletingError && (
                <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-xs text-danger">
                  {deletingError}
                </div>
              )}
              <p className="text-xs text-danger mb-4">
                Are you sure? All your data will be permanently deleted. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setConfirmDelete(false); setDeletingError('') }}
                  disabled={deleting}
                  className="flex-1 h-11 bg-raised text-muted text-sm font-medium rounded-md border border-border hover:text-fg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 h-11 bg-danger text-bg text-sm font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete my account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
