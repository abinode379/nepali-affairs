'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../lib/supabase-browser';

interface Submission {
  id: string;
  title: string | null;
  story: string | null;
  category: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');

  async function loadDashboard({ manual }: { manual?: boolean } = {}) {
    try {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? 'Unable to load dashboard.');
        return;
      }

      setSubmissions(body.submissions);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError('Unable to load dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div className="space-y-8">
      {error && <div className="rounded-[1.5rem] border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">{error}</div>}

      <div className="flex flex-col gap-4 rounded-[2rem] border border-[#222222] bg-[#111111] p-6 shadow-[0_24px_80px_rgba(255,255,255,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#A1A1AA]">Admin control</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Confession list</h2>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => loadDashboard({ manual: true })}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center rounded-full border border-[#A1A1AA]/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Refreshing
                </span>
              ) : (
                'Refresh list'
              )}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full border border-[#A1A1AA]/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
          {lastUpdated && <p className="text-sm text-[#A1A1AA]">Last refresh: {lastUpdated}</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#222222] bg-[#111111] shadow-[0_24px_80px_rgba(255,255,255,0.06)]">
        <div className="px-6 py-4 text-sm text-[#A1A1AA]">Click a confession row to preview it in a popup.</div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-[#0f0f0f] text-[#A1A1AA]">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr className="border-t border-white/5">
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-[#A1A1AA]">
                    No confessions found.
                  </td>
                </tr>
              ) : (
                submissions.map(item => (
                  <tr
                    key={item.id}
                    className={`border-t border-white/5 transition hover:bg-white/5 ${selectedId === item.id ? 'bg-white/5' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-6 py-4 text-white">{item.title ?? 'Untitled'}</td>
                    <td className="px-6 py-4 text-[#A1A1AA]">{item.category}</td>
                    <td className="px-6 py-4 text-[#A1A1AA]">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className="px-6 py-4 text-sm text-[#A1A1AA]">Loading latest submissions…</div>}
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#111111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#A1A1AA]">Confession preview</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{submissions.find(item => item.id === selectedId)?.title ?? 'Untitled'}</h3>
                <p className="mt-2 text-sm text-[#A1A1AA]">
                  {submissions.find(item => item.id === selectedId)?.category} • {new Date(submissions.find(item => item.id === selectedId)?.created_at ?? '').toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#2A2A2A] bg-black/70 p-6 text-sm leading-7 text-[#E5E7EB]">
              {submissions.find(item => item.id === selectedId)?.story ?? 'No story available.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
