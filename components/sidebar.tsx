'use client';

import { Mail, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function BlogSidebar() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fiverrServices = [
    {
      title: 'AI Chatbot Development',
      description: 'Custom AI-powered chatbots with authentication and memory',
      price: 'Starting at $500',
      icon: '💬',
      link: 'https://www.fiverr.com/myousaf_codes/develop-ai-powered-chatbot',
    },
    {
      title: 'Full-Stack Web Apps',
      description: 'Next.js + FastAPI production-ready applications',
      price: 'Starting at $800',
      icon: '🚀',
      link: 'https://www.fiverr.com/myousaf_codes/build-fullstack-web-app',
    },
    {
      title: 'API Integration',
      description: 'Seamless third-party API integrations for your apps',
      price: 'Starting at $300',
      icon: '🔌',
      link: 'https://www.fiverr.com/myousaf_codes/integrate-apis',
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed!');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Newsletter */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Mail size={15} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-base">Newsletter</h3>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Get the latest posts and insights on AI development delivered to your inbox weekly.
          No spam, ever.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            suppressHydrationWarning
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-zinc-400 transition"
          />
          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing…' : 'Subscribe — It\'s Free'}
          </button>
        </form>
        {message && (
          <p className={`text-xs font-medium ${message.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Fiverr Services */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <span className="text-lg">💼</span>
          <span>Hire Me on Fiverr</span>
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Need a custom AI-powered application? Let&apos;s build it together.
        </p>
        <div className="space-y-3">
          {fiverrServices.map((service, idx) => (
            <a
              key={idx}
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group"
            >
              <span className="text-xl flex-shrink-0">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-0.5 group-hover:text-blue-500 transition-colors leading-snug">
                  {service.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-500">{service.price}</span>
                  <ChevronRight size={13} className="text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
        <a
          href="https://www.fiverr.com/myousaf_codes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          View All Services <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}

