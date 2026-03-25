'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const projectOptions = [
  'Full-Stack Web App',
  'AI/ML Integration',
  'Agentic AI System',
  'API + Backend',
  'Consulting',
  'Other',
];

export default function ContactForm() {
  const [inquiryType, setInquiryType] = useState<'audience' | 'client'>('audience');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(projectOptions[0]);
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('General question');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType,
          name: name.trim(),
          email: email.trim(),
          projectType: inquiryType === 'client' ? projectType : undefined,
          topic: inquiryType === 'audience' ? topic.trim() : undefined,
          message: message.trim(),
        }),
      });

      let data: { success?: boolean; message?: string; error?: string } = {};
      try {
        data = (await response.json()) as { success?: boolean; message?: string; error?: string };
      } catch {
        data = {};
      }

      if (response.ok && data.success) {
        setStatus({ type: 'success', text: data.message || 'Thanks. Your message was sent.' });
        setName('');
        setEmail('');
        setProjectType(projectOptions[0]);
        setTopic('General question');
        setMessage('');
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to send. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">I am reaching out as</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'audience' as const, label: 'Audience / Learner' },
            { key: 'client' as const, label: 'Client / Founder' },
          ].map((option) => {
            const active = inquiryType === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setInquiryType(option.key)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-blue-400'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {inquiryType === 'client' ? (
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Project type
          <select
            value={projectType}
            onChange={(event) => setProjectType(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Topic
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Question, feedback, collab, roadmap request..."
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      )}

      <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Message
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            inquiryType === 'client'
              ? 'Tell me about your project, timeline, and goals.'
              : 'Share your question, feedback, or what you need help with.'
          }
          rows={5}
          required
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Sending…' : inquiryType === 'client' ? 'Send Project Inquiry' : 'Send Message'}
      </button>

      {status && (
        <p
          className={`text-xs font-medium ${
            status.type === 'success' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
