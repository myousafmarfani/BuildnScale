'use client';

import { useState } from 'react';

type RoadmapNotifyModalProps = {
  roadmapTitle: string;
};

export default function RoadmapNotifyModal({ roadmapTitle }: RoadmapNotifyModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const closeModal = () => {
    setOpen(false);
    setMessage('');
    setIsError(false);
    setFieldError('');
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Email is required.';
    }

    if (!value.includes('@')) {
      return 'Enter a valid email address.';
    }

    return '';
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setIsError(false);
    setFieldError('');

    const nextError = validateEmail(email);
    if (nextError) {
      setFieldError(nextError);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/roadmap-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          roadmapTitle,
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request. Please try again.');
      }

      setMessage(data.message || 'You are on the list. We will notify you when this roadmap launches.');
      setEmail('');
      setFieldError('');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
      >
        Notify Me
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-label="Notify me for roadmap launch">
          <div className="w-full max-w-md rounded-2xl border border-blue-200/80 bg-white p-5 shadow-2xl dark:border-blue-900/40 dark:bg-zinc-900">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Get launch notification</h3>
                <p className="mt-1 text-sm text-muted-foreground">{roadmapTitle} is in progress. Enter your email and we will notify you when it goes live.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close notification modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <label htmlFor="notify-email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                aria-invalid={fieldError ? 'true' : 'false'}
                aria-describedby={fieldError ? 'notify-email-error' : undefined}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-2 ${
                  fieldError ? 'border-red-500/70' : 'border-border'
                }`}
              />
              {fieldError ? (
                <p id="notify-email-error" className="text-xs text-red-600 dark:text-red-400">
                  {fieldError}
                </p>
              ) : null}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>

            {message ? (
              <p className={`mt-3 text-sm ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                {message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
