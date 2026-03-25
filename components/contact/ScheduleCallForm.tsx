'use client';

import { useMemo, useState } from 'react';

const projectOptions = [
  'Discovery / Intro Call',
  'Full-Stack Web App',
  'AI/ML Integration',
  'Agentic AI System',
  'API + Backend',
  'Consulting',
  'Other',
];

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export default function ScheduleCallForm() {
  const [date, setDate] = useState(getTodayDate());
  const [timezone, setTimezone] = useState('UTC');
  const [time, setTime] = useState('09:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(projectOptions[0]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const timezoneOptions = useMemo(
    () => [
      'UTC',
      'Asia/Karachi (PKT)',
      'Asia/Dubai (GST)',
      'Asia/Kolkata (IST)',
      'Europe/London (GMT/BST)',
      'Europe/Berlin (CET/CEST)',
      'America/New_York (ET)',
      'America/Chicago (CT)',
      'America/Denver (MT)',
      'America/Los_Angeles (PT)',
    ],
    []
  );

  const timeSlots = useMemo(
    () => [
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
      '06:00 PM',
      '07:00 PM',
      '08:00 PM',
      '09:00 PM',
      '10:00 PM',
      '11:00 PM',
      '12:00 AM',
    ],
    []
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          timezone,
          time,
          name: name.trim(),
          email: email.trim(),
          projectType,
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
        setStatus({ type: 'success', text: data.message || 'Call request sent successfully.' });
        setName('');
        setEmail('');
        setProjectType(projectOptions[0]);
        setMessage('');
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to submit call request.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Preferred date
          <input
            type="date"
            value={date}
            min={getTodayDate()}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Timezone
          <select
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezoneOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Preferred time
          <select
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
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

      <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Message / agenda
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="What should we discuss in this call?"
          rows={4}
          required
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Submitting…' : 'Request Call Schedule'}
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
