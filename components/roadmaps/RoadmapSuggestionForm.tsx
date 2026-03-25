'use client';

import { useState } from 'react';

type RoadmapSuggestionFormProps = {
  className?: string;
};

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: '',
  email: '',
  topic: '',
  message: '',
};

export default function RoadmapSuggestionForm({ className }: RoadmapSuggestionFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = (state: FormState): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!state.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!state.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!state.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!state.topic.trim()) {
      nextErrors.topic = 'Topic is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback('');
    setIsError(false);

    const nextErrors = validate(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/roadmap-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit your request.');
      }

      setFeedback(data.message || 'Thanks. We will notify you when your request is fulfilled.');
      setFormState(initialState);
      setErrors({});
    } catch (error) {
      setIsError(true);
      setFeedback(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="roadmap-name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="roadmap-name"
            type="text"
            value={formState.name}
            onChange={updateField('name')}
            placeholder="Your name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'roadmap-name-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 ${
              errors.name ? 'border-red-500/70' : 'border-border'
            } bg-background`}
            required
          />
          {errors.name ? (
            <p id="roadmap-name-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="roadmap-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="roadmap-email"
            type="email"
            value={formState.email}
            onChange={updateField('email')}
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'roadmap-email-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 ${
              errors.email ? 'border-red-500/70' : 'border-border'
            } bg-background`}
            required
          />
          {errors.email ? (
            <p id="roadmap-email-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <label htmlFor="roadmap-topic" className="text-sm font-medium text-foreground">
          Topic
        </label>
        <input
          id="roadmap-topic"
          type="text"
          value={formState.topic}
          onChange={updateField('topic')}
          placeholder="Roadmap topic you want covered"
          aria-invalid={errors.topic ? 'true' : 'false'}
          aria-describedby={errors.topic ? 'roadmap-topic-error' : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 ${
            errors.topic ? 'border-red-500/70' : 'border-border'
          } bg-background`}
          required
        />
        {errors.topic ? (
          <p id="roadmap-topic-error" className="text-xs text-red-600 dark:text-red-400">
            {errors.topic}
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-1">
        <label htmlFor="roadmap-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="roadmap-message"
          rows={4}
          value={formState.message}
          onChange={updateField('message')}
          placeholder="Share what you want to learn or why this roadmap matters to you."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
        <p className="text-xs text-muted-foreground">
          You will be notified once your request is fulfilled.
        </p>
      </div>

      {feedback ? (
        <p className={`mt-3 text-sm ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
