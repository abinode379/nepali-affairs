'use client';

import { FormEvent, useState } from 'react';

const categories = ['Crush', 'Relationship', 'Marriage', 'Secret', 'Friendship', 'Other'] as const;

type Category = (typeof categories)[number];

export default function SubmitPage() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState<Category>('Crush');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isFormValid = story.length > 0;
  const storyValid = story.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!storyValid) {
      setError('Please write your confession before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, story, category })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error ?? 'Unable to submit confession at this time.');
      } else {
        setSuccessMessage(result?.message ?? 'Submitted successfully.');
        setTitle('');
        setStory('');
        setCategory('Crush');
      }
    } catch (err) {
      setError('Unable to submit confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-black py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8 rounded-[2rem] border border-[#222222] bg-[#111111] p-8 shadow-[0_24px_80px_rgba(255,255,255,0.07)]">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-medium text-[#A1A1AA]">Title</span>
              <input
                type="text"
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder="Short summary (optional)"
                className="w-full rounded-3xl border border-[#2A2A2A] bg-black/70 px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-medium text-[#A1A1AA]">Category</span>
              <div className="relative">
                <select
                  value={category}
                  onChange={event => setCategory(event.target.value as Category)}
                  className="w-full appearance-none rounded-3xl border border-[#2A2A2A] bg-black/70 px-4 py-3 pr-12 text-white outline-none transition focus:border-white/40"
                >
                  {categories.map(option => (
                    <option key={option} value={option} className="bg-black text-white">
                      {option}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#A1A1AA]">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </label>
          </div>

          <label className="space-y-3">
            <span className="text-sm font-medium text-[#A1A1AA]">Story</span>
            <textarea
              value={story}
              onChange={event => setStory(event.target.value)}
              placeholder="Write your anonymous confession here."
              rows={10}
              className="w-full rounded-[2rem] border border-[#2A2A2A] bg-black/70 px-4 py-4 text-white outline-none transition focus:border-white/40"
              required
            />
          </label>


          {error && (
            <p role="alert" aria-live="assertive" className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          {successMessage && (
            <p role="status" aria-live="polite" className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </p>
          )}

          {successMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-xl rounded-[2rem] border border-emerald-500/30 bg-[#111111] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Confession submitted</h2>
                    <p className="mt-3 text-sm text-[#A1A1AA]">Thank you! If your confession is good and interesting, it may be published on TikTok.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage('')}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
                <p className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 text-sm text-emerald-200">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                Submitting…
              </span>
            ) : (
              'Submit confession'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
