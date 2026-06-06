'use client';

import { FormEvent, useState } from 'react';
import type { SubscribeResponse } from '../types';

export default function SubscribeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');

    if (typeof email !== 'string') {
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = (await response.json()) as SubscribeResponse & { error?: string };

      if (!response.ok || 'error' in data) {
        throw new Error(data.error ?? 'Unable to subscribe at this time.');
      }

      setStatus('success');
      setMessage(data.message);
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Subscription failed.');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} aria-labelledby="newsletter-title">
      <label htmlFor="email" className="block text-sm font-medium text-[#A1A1AA]">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className="w-full rounded-3xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-white focus:ring-2 focus:ring-white/10"
      />

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-3xl border border-[#222222] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Subscribe'}
      </button>

      {message ? (
        <p className={`text-sm ${status === 'success' ? 'text-white' : 'text-[#A1A1AA]'}`}>{message}</p>
      ) : (
        <p className="text-sm text-[#A1A1AA]">No spam, just news and cultural updates.</p>
      )}
    </form>
  );
}
