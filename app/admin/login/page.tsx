'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '../../../lib/supabase-browser';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unauthorized = searchParams.get('unauthorized');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      await router.push('/admin');
    } catch (err) {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-black text-white min-h-screen py-24">
      <div className="mx-auto max-w-md space-y-8 rounded-[2rem] border border-[#222222] bg-[#111111] p-10 shadow-[0_24px_80px_rgba(255,255,255,0.06)]">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#A1A1AA]">Admin access</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Admin login</h1>
          <p className="text-[#A1A1AA]">Only authenticated admin accounts may access the dashboard.</p>
        </div>

        {(unauthorized || error) && (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error || 'You are signed in, but this account is not authorized for admin access.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2 text-sm text-[#A1A1AA]">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="w-full rounded-3xl border border-[#2A2A2A] bg-black/70 px-4 py-3 text-white outline-none transition focus:border-white/40"
            />
          </label>

          <label className="block space-y-2 text-sm text-[#A1A1AA]">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="w-full rounded-3xl border border-[#2A2A2A] bg-black/70 px-4 py-3 text-white outline-none transition focus:border-white/40"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}
